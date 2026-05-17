import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromCookies } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const payload = await getUserFromCookies();
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let projectQuery = {};
    let taskQuery = {};
    
    // For members, only show stats for their assigned tasks or projects they own (though normally members don't own projects).
    // Let's keep it simple: Admin sees all, Member sees their assigned tasks.
    if (payload.role !== 'ADMIN') {
      taskQuery = { assigneeId: payload.userId };
      projectQuery = { tasks: { some: { assigneeId: payload.userId } } }; // Projects they are involved in
    }

    const [totalProjects, totalTasks, tasksByStatus, overdueTasks] = await Promise.all([
      prisma.project.count({ where: projectQuery }),
      prisma.task.count({ where: taskQuery }),
      prisma.task.groupBy({
        by: ['status'],
        where: taskQuery,
        _count: { status: true },
      }),
      prisma.task.count({
        where: {
          ...taskQuery,
          dueDate: { lt: new Date() },
          status: { not: 'DONE' },
        },
      }),
    ]);

    const statusCounts = {
      TODO: 0,
      IN_PROGRESS: 0,
      DONE: 0,
    };

    tasksByStatus.forEach(stat => {
      if (stat.status in statusCounts) {
        statusCounts[stat.status as keyof typeof statusCounts] = stat._count.status;
      }
    });

    return NextResponse.json({
      totalProjects,
      totalTasks,
      statusCounts,
      overdueTasks,
    });
  } catch (error) {
    console.error('Dashboard GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
