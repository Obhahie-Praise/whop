"use server";

import { prisma } from "@/lib/prisma";
import { unstable_cache, revalidatePath, revalidateTag } from "next/cache";
import { 
  startOfDay, 
  endOfDay,
  subDays, 
  startOfMonth, 
  endOfMonth,
  eachDayOfInterval,
  format,
  isSameDay, 
  differenceInDays 
} from "date-fns";

export async function joinWaitlist(email: string, source: string | null) {
  if (!email || !email.includes("@")) {
    return { success: false, error: "Please enter a valid email address." };
  }

  try {
    await prisma.waitlist.create({
      data: {
        email,
        source: source || null,
      },
    });
    return { success: true };
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "P2002") {
      return { success: false, error: "This email is already on the waitlist!" };
    }
    return { success: false, error: "Failed to join. Please try again." };
  }
}

const getCachedUsers = unstable_cache(
  async () => {
    return prisma.waitlist.findMany({
      orderBy: {
        joinedAt: "desc",
      },
    });
  },
  ["waitlist-users"],
  { tags: ["waitlist"], revalidate: 3600 } // Cache for 1 hour by default
);

export async function getWaitlistUsers() {
  try {
    const users = await getCachedUsers();
    return { success: true, users };
  } catch (error) {
    console.error("Error fetching waitlist users:", error);
    return { success: false, error: "Failed to fetch waitlist users." };
  }
}

export async function refreshWaitlist() {
  try {
    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    console.error("Error refreshing waitlist:", error);
    return { success: false, error: "Failed to refresh waitlist data." };
  }
}

const getCachedAdminMetrics = unstable_cache(
  async () => {
    const now = new Date();
    const today = startOfDay(now);
    const yesterday = subDays(today, 1);
    const startOfCurrentMonth = startOfMonth(now);
    const startOfLastMonth = startOfMonth(subDays(startOfCurrentMonth, 1));

    // 1. Total Users & Trend
    const totalUsers = await prisma.waitlist.count();
    const totalLastMonth = await prisma.waitlist.count({
      where: {
        joinedAt: { lt: startOfCurrentMonth }
      }
    });
    
    // Growth vs start of month
    const totalUserTrend = totalLastMonth === 0 ? 100 : Math.round(((totalUsers - totalLastMonth) / totalLastMonth) * 100);

    // 2. Top Source
    const sourceGroups = await prisma.waitlist.groupBy({
      by: ['source'],
      _count: {
        _all: true
      },
      orderBy: {
        _count: {
          source: 'desc'
        }
      },
      take: 1
    });
    const topSource = sourceGroups[0]?.source || "Direct";
    const topSourceCount = sourceGroups[0]?._count._all || 0;
    const topSourceTrend = totalUsers === 0 ? 0 : Math.round((topSourceCount / totalUsers) * 100);

    // 3. Joined Today & Trend
    const joinedToday = await prisma.waitlist.count({
      where: {
        joinedAt: { gte: today }
      }
    });
    const joinedYesterday = await prisma.waitlist.count({
      where: {
        joinedAt: { gte: yesterday, lt: today }
      }
    });
    const joinedTodayTrend = joinedYesterday === 0 ? (joinedToday > 0 ? 100 : 0) : Math.round(((joinedToday - joinedYesterday) / joinedYesterday) * 100);

    // 4. Join Streak
    const allUserDates = await prisma.waitlist.findMany({
      select: { joinedAt: true },
      orderBy: { joinedAt: 'desc' }
    });

    const uniqueDates = Array.from(new Set(allUserDates.map(u => startOfDay(new Date(u.joinedAt)).getTime()))).sort((a, b) => b - a);
    
    let streak = 0;
    if (uniqueDates.length > 0) {
      let checkDate = today;
      if (uniqueDates[0] !== today.getTime() && uniqueDates[0] === yesterday.getTime()) {
        checkDate = yesterday;
      }

      if (uniqueDates[0] === today.getTime() || uniqueDates[0] === yesterday.getTime()) {
        for (let i = 0; i < uniqueDates.length; i++) {
          if (uniqueDates[i] === checkDate.getTime()) {
            streak++;
            checkDate = subDays(checkDate, 1);
          } else {
            break;
          }
        }
      }
    }

    return {
      totalUsers,
      totalUserTrend,
      topSource,
      topSourceTrend,
      joinedToday,
      joinedTodayTrend,
      streak
    };
  },
  ["admin-metrics"],
  { tags: ["admin-metrics"], revalidate: 3600 }
);

const getCachedGrowthMetrics = unstable_cache(
  async () => {
    const now = new Date();
    const start = startOfMonth(now);
    const end = endOfMonth(now);
    
    // Get all days in current month
    const days = eachDayOfInterval({ start, end });

    const growthData = await Promise.all(
      days.map(async (day) => {
        const dayStart = startOfDay(day);
        const dayEnd = endOfDay(day);
        
        const count = await prisma.waitlist.count({
          where: {
            joinedAt: {
              gte: dayStart,
              lte: dayEnd,
            },
          },
        });
        
        return {
          month: format(day, "MMM d"), // e.g., "Mar 1"
          users: count,
        };
      })
    );

    return growthData;
  },
  ["growth-metrics-daily"],
  { tags: ["growth-metrics"], revalidate: 3600 }
);

export async function getGrowthMetrics() {
  try {
    const data = await getCachedGrowthMetrics();
    return {
      success: true,
      data
    };
  } catch (error) {
    console.error("Error fetching growth metrics:", error);
    return { success: false, error: "Failed to fetch growth metrics." };
  }
}

export async function getAdminMetrics() {
  try {
    const metrics = await getCachedAdminMetrics();
    return {
      success: true,
      metrics
    };
  } catch (error) {
    console.error("Error calculating admin metrics:", error);
    return { success: false, error: "Failed to calculate metrics." };
  }
}

export async function refreshAdminMetrics() {
  try {
    revalidatePath("/admin/overview");
    return { success: true };
  } catch (error) {
    console.error("Error refreshing admin metrics:", error);
    return { success: false, error: "Failed to refresh metrics." };
  }
}

export async function deleteWaitlistUsers(ids: string[]) {
  try {
    await prisma.waitlist.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
    return { success: true };
  } catch (error) {
    console.error("Error deleting waitlist users:", error);
    return { success: false, error: "Failed to delete waitlist users." };
  }
}
