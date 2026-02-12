import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useState, useEffect } from 'react'
import type { FlowStep } from '../../../models/approval/detail'
import { Menu01Icon } from 'hugeicons-react'

interface ReorderStepModalProps {
  isOpen: boolean
  onClose: () => void
  flowSteps: FlowStep[]
  onSave?: (reorderedIds: string[]) => void
}

function SortableStepItem({ step }: { step: FlowStep }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: step.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 bg-white/50 dark:bg-gray-800/50 rounded-lg p-3 mb-2 border border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800 transition-all"
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
      >
        <Menu01Icon className="w-5 h-5 text-blue-500" />
      </button>
      <div className="flex-1">
        <p className="font-medium text-gray-900 dark:text-white">
          {step.step_name}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {step.role_name} • {step.type}
        </p>
      </div>
      <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded">
        Step {step.step_order}
      </span>
    </div>
  )
}

export default function ReorderStepModal({
  isOpen,
  onClose,
  flowSteps,
  onSave,
}: ReorderStepModalProps) {
  const [steps, setSteps] = useState<FlowStep[]>(flowSteps)

  useEffect(() => {
    setSteps(flowSteps)
  }, [flowSteps])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setSteps((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)

        const reorderedItems = arrayMove(items, oldIndex, newIndex)

        return reorderedItems.map((item, index) => ({
          ...item,
          step_order: index + 1,
        }))
      })
    }
  }

  const handleSave = () => {
    const reorderedIds = steps.map((step) => step.id)
    console.log('Reordered Step IDs:', reorderedIds)
    console.log('Reordered Steps with new order:', steps)

    if (onSave) {
      onSave(reorderedIds)
    }

    onClose()
  }

  const handleClose = () => {
    setSteps(flowSteps)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-gray-900 opacity-50"
        onClick={handleClose}
      />

      {/* Modal Content */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl w-full max-w-md mx-4 p-6 z-10 border-2 border-blue-200 dark:border-blue-700 shadow-xl">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-100">
            Approval Step
          </h2>
          <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
            Drag to reorder the approval steps
          </p>
        </div>

        {/* Sortable List */}
        <div className="max-h-96 overflow-y-auto mb-6 px-1">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={steps.map((step) => step.id)}
              strategy={verticalListSortingStrategy}
            >
              {steps.map((step) => (
                <SortableStepItem key={step.id} step={step} />
              ))}
            </SortableContext>
          </DndContext>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200 shadow-md hover:shadow-lg border-2 border-blue-700 dark:border-blue-500"
        >
          Save
        </button>
      </div>
    </div>
  )
}