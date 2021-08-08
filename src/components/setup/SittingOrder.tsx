import React, { ChangeEvent, useState } from 'react';
import PersonIcon from '@material-ui/icons/Person';
import { Button, TextField, Typography } from '@material-ui/core';
import { DragDropContext, Draggable, DraggableStateSnapshot, DraggingStyle, Droppable, DropResult, NotDraggingStyle } from 'react-beautiful-dnd';

export interface Props {
  playerCount: number,
  nameReport: (names: string[]) => void
}

const getStyle = (style: DraggingStyle | NotDraggingStyle | undefined, snapshot: DraggableStateSnapshot) => {
  if (!snapshot.isDropAnimating) {
    return style;
  }
  return {
    ...style,
    // cannot be 0, but make it super tiny
    transitionDuration: `0.001s`,
  };
}

const colors = ['red', 'blue', 'green', 'pink']

const SittingOrder: React.FC<Props> = ({ playerCount, nameReport}) => {
  const [players, setPlayer] = useState<{name: string, color: string}[]>(Array.from(Array(4).keys()).map(i => ({name: '', color: colors[i]})));
  const [error, setError] = useState<string | undefined>();

  const onDragEnd = (result: DropResult) => {
    const {source, destination } = result;

    if(!destination) return;
    if(destination.droppableId === source.droppableId) return;

    setPlayer(curr => {
      const newPlayerNames = [...curr];

      newPlayerNames[destination.index] = curr[source.index];
      newPlayerNames[source.index] = curr[destination.index];

      return newPlayerNames;
    })
  }

  const submit = () => {
    const slice = players.slice(0, playerCount);

    if(slice.map(player => player.name).filter(name => name === '').length) {
      setError("All names must be entered")
      return;
    }

    if(slice.map(player => player.name).filter((name) => {
      const mapped = slice.map(p => p.name);
      return mapped.indexOf(name) !== mapped.lastIndexOf(name);
    }).length) {
      setError("All names must be unique");
      return;
    }

    if(error) setError(undefined);

    nameReport(players.slice(0, playerCount).map(player => player.name));
  }

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, index: number) => {
    setPlayer(curr => {
      const newPlayerNames = [...curr];
      newPlayerNames[index] = {
        ...curr[index],
        name: e.target.value.trim()
      };

      return newPlayerNames;
    })
  }

  return (
    <DragDropContext  onDragEnd={onDragEnd}>
      <div className="droppable-container">
        {Array.from(Array(playerCount).keys()).map(i => (
          <Droppable
            key={`Player ${i+1}`}
            droppableId={`Position ${i}`}
          >
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={`droppable players-${playerCount}`}
              >
                <Draggable
                  draggableId={`${i}`}
                  index={i}
                >
                  {(provided, snapshot) => (
                    <div
                      {...provided.dragHandleProps}
                      {...provided.draggableProps}
                      ref={provided.innerRef}
                      className="draggable"
                      style={getStyle(provided.draggableProps.style, snapshot)}
                    >
                      <PersonIcon style={{marginTop: '0.5em', color: players[i].color}} />
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          submit();
                        }}
                        style={{marginTop: '0.5em'}}
                        noValidate
                        autoComplete="off"
                      >
                        <TextField
                          id="outlined-basic"
                          label={`Player ${i+1}`}
                          variant="outlined"
                          value={players[i].name}
                          onChange={(e) => handleChange(e, i)}
                        />
                      </form>
                    </div>
                  )}
                </Draggable>
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
      <Button
        variant="contained"
        color="primary"
        style={{width: '100px'}}
        onClick={submit}
      >
        Start
      </Button>
      {error && (
        <Typography color="error" style={{marginTop: '0.5em'}}>{error}</Typography>
      )}
    </DragDropContext>
  );
};

export default SittingOrder;