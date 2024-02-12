import { KanbanBoardContainer, KanbanBoard } from '@/components/tasks/kanban/board'
import KanbanColumn from '@/components/tasks/kanban/column'
import { TASKS_QUERY, TASK_STAGES_QUERY } from '@/graphql/queries'
import { useList } from '@refinedev/core'
import React from 'react'
import { KanbanItem } from './item'
import { TaskStage } from '@/graphql/schema.types'
import KanbanColumnSkeleton from '@/components/skeleton/kanban'

export const TasksList = () => {
  const { data: stages, isLoading: isLoadingStages } = useList({
    resource: 'taskStages',
    meta: {
      gqlQuery: TASK_STAGES_QUERY
    },
    filters: [
      {
        field: 'title',
        operator: 'in',
        value: ['TO DO', 'IN PROGRESS', 'IN REVIEW', 'DONE']
      }
    ],
    sorters: [
      {
        field: 'createdAt',
        order: 'asc'
      }
    ]
  })
  
  const { data: tasks, isLoading: isLoadingTasks } = useList({
    resource: 'tasks',
    sorters: [
      {
        field: 'dueDate',
        order: 'desc'
      }
    ],
    queryOptions: {
      enabled: !!stages
    },
    pagination: {
      mode: 'off'
    },
    meta: {
      gqlQuery: TASKS_QUERY
    }
  }) 

  const taskStages = React.useMemo(() => {
    if (!tasks?.data || !stages?.data)
      return {
        unassignedStage: [],
        stages: [],
      };

    const unassignedStage = tasks.data.filter((task) => task.stageId === null);

    // prepare unassigned stage
    const grouped: TaskStage[] = stages.data.map((stage) => ({
      ...stage,
      tasks: tasks.data.filter((task) => task.stageId?.toString() === stage.id),
    }));

    return {
      unassignedStage,
      columns: grouped,
    };
  }, [tasks, stages]);

  const handleAddCard = (args: { stageId: string }) => {}

  return (
    <>
      <KanbanBoardContainer>
        <KanbanBoard>
          <KanbanColumnSkeleton 
            id='unassigned'
            title={"unassigned"}
            count={taskStages.unassignedStage.length || 0}
            onAddClick={() => handleAddCard({ stageId: 'unassigned' })}
          >
           {taskStages.unassignedStage.map((task) => (
              <KanbanItem key={task.id} id={task.id} data={{ ...task, stageId: 'unassigned' }}>
                {task.title}
              </KanbanItem>
           ))}
          </KanbanColumn>
          
        </KanbanBoard>  
      </KanbanBoardContainer>      
    </>
  )
}
