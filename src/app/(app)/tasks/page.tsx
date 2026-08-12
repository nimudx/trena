import { getAllTasks, getProjectOptions } from "@/lib/data";
import { KanbanBoard } from "@/components/kanban-board";
import { NewTaskButton } from "@/components/new-task-button";

export default async function TasksPage() {
  const [tasks, projects] = await Promise.all([
    getAllTasks(),
    getProjectOptions(),
  ]);

  const kanbanTasks = tasks.map((t) => ({
    id: t.id,
    title: t.title,
    description: t.description,
    priority: t.priority,
    status: t.status,
    tags: t.tags,
    due: t.due,
    projectId: t.projectId,
    projectName: t.project.name,
  }));

  return (
    <div>
      <div className="mb-6 flex items-baseline justify-between">
        <h1 className="text-2xl font-semibold">Tareas</h1>
        <NewTaskButton projects={projects} />
      </div>
      <KanbanBoard tasks={kanbanTasks} projects={projects} showProjectBadge />
    </div>
  );
}
