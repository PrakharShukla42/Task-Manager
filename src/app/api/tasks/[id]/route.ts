import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromCookies } from '@/lib/auth';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const payload = await getUserFromCookies();
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const taskId = (await params).id;
    const { title, description, status, priority, dueDate, assigneeId } = await req.json();

    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    // Members can only update status of tasks assigned to them.
    // Admins can update anything.
    if (payload.role !== 'ADMIN') {
      if (task.assigneeId !== payload.userId) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      
      const updatedTask = await prisma.task.update({
        where: { id: taskId },
        data: { status },
      });
      return NextResponse.json(updatedTask);
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        title: title || task.title,
        description: description !== undefined ? description : task.description,
        status: status || task.status,
        priority: priority || task.priority,
        dueDate: dueDate ? new Date(dueDate) : task.dueDate,
        assigneeId: assigneeId !== undefined ? assigneeId : task.assigneeId,
      },
    });

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error('Task PUT error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const payload = await getUserFromCookies();
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    if (payload.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const taskId = (await params).id;
    await prisma.task.delete({
      where: { id: taskId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Task DELETE error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
