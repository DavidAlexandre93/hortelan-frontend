import PropTypes from 'prop-types';
import { Card, Stack, Checkbox, CardHeader, FormControlLabel } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';

AppTasks.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  list: PropTypes.array.isRequired,
};

export default function AppTasks({ title, subheader, list, ...other }) {
  const { control } = useForm({
    defaultValues: {
      taskCompleted: ['2'],
    },
  });

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />
      <Controller
        name="taskCompleted"
        control={control}
        render={({ field }) => {
          const toggleTask = (taskId) =>
            field.value.includes(taskId)
              ? field.value.filter((currentId) => currentId !== taskId)
              : [...field.value, taskId];

          return list.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              checked={field.value.includes(task.id)}
              onChange={() => field.onChange(toggleTask(task.id))}
            />
          ));
        }}
      />
    </Card>
  );
}

TaskItem.propTypes = {
  checked: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  task: PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  }).isRequired,
};

function TaskItem({ task, checked, onChange }) {
  return (
    <Stack
      sx={{
        px: 2,
        py: 0.75,
        ...(checked && {
          color: 'text.secondary',
          textDecoration: 'line-through',
        }),
      }}
    >
      <FormControlLabel control={<Checkbox checked={checked} onChange={onChange} />} label={task.label} sx={{ m: 0 }} />
    </Stack>
  );
}
