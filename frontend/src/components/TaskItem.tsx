import React from 'react';
import { Task } from '../models/task.model';
import { ListItem, ListItemText, Checkbox, IconButton, Typography, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { TaskUpdatePayload } from '../services/task.service'; // Importiere den Payload-Typ

interface TaskItemProps {
  task: Task;
  onUpdate: (taskId: string, updates: TaskUpdatePayload) => void; // Callback für Updates
  onDelete: (taskId: string) => void; // Callback für Löschen
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onUpdate, onDelete }) => {

  const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newStatus = event.target.checked ? 'done' : 'open';
    onUpdate(task.id, { status: newStatus });
  };

  const handleDeleteClick = () => {
    onDelete(task.id);
  };

  // Formatierung für das Fälligkeitsdatum (optional)
  const formattedDueDate = task.dueDate
    ? `Fällig: ${task.dueDate.toDate().toLocaleDateString()}`
    : null;

  return (
    <ListItem
      key={task.id}
      disablePadding
      secondaryAction={
        <IconButton edge="end" aria-label="delete" onClick={handleDeleteClick}>
          <DeleteIcon />
        </IconButton>
      }
    >
      <Checkbox
        edge="start"
        checked={task.status === 'done'}
        onChange={handleStatusChange}
        tabIndex={-1}
        disableRipple
        inputProps={{ 'aria-labelledby': `checkbox-list-label-${task.id}` }}
      />
      <ListItemText
        id={`checkbox-list-label-${task.id}`}
        primary={
            <Typography sx={{ textDecoration: task.status === 'done' ? 'line-through' : 'none' }}>
                {task.title}
            </Typography>
        }
        secondary={formattedDueDate}
      />
    </ListItem>
  );
};

export default TaskItem; 