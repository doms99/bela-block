import React, { ChangeEvent, useState } from 'react';
import { DragDropContext, Draggable, DraggableStateSnapshot, DraggingStyle, Droppable, DropResult, NotDraggingStyle } from 'react-beautiful-dnd';
import { PlayersError } from '../../interfaces';
import PlayerBox from './views/PlayerBox';

export interface Props {
  playerCount: number,
  playerNames: string[],
  setName: (name: string, index: number) => void,
  error?: PlayersError
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

const SittingOrder: React.FC<Props> = ({ playerCount, playerNames, setName, error }) => {
  
  const onDragEnd = (result: DropResult) => {
    const {source, destination } = result;

    if(!destination) return;
    if(destination.droppableId === source.droppableId) return;

    const temp = playerNames[source.index];
    setName(playerNames[destination.index], source.index);
    setName(temp, destination.index);
  }

  return (
    <div className="relative w-50vh h-50vh m-auto border-8 rounded-full border-white">
      {playerNames.slice(0, playerCount).map((name, index) => (
        <PlayerBox
          name={name}
          playerNumber={index + 1}
          setName={(name: string) => setName(name, index)}
          playerCount={playerCount}
          error={error?.sources.includes(index)}
        />
      ))}
    </div>
    // <DragDropContext  onDragEnd={onDragEnd}>
    //   <div className="relative w-50vh h-50vh m-auto border-8 rounded-full border-white">
    //     {playerNames.slice(0, playerCount).map((name, index) => (
    //       <Droppable
    //         key={`Player ${index+1}`}
    //         droppableId={`Position ${index}`}
    //       >
    //         {(provided) => (
    //           <div
    //             {...provided.droppableProps}
    //             ref={provided.innerRef}
    //             className={`droppable players-${playerCount}`}
    //           >
    //             <Draggable
    //               draggableId={`${index}`}
    //               index={index}
    //             >
    //               {(provided, snapshot) => (
    //                 <div
    //                   {...provided.dragHandleProps}
    //                   {...provided.draggableProps}
    //                   ref={provided.innerRef}
    //                   style={getStyle(provided.draggableProps.style, snapshot)}
    //                 >
    //                   <PlayerBox
    //                     name={name}
    //                     playerNumber={index + 1}
    //                     setName={(name: string) => setName(name, index)}
    //                     playerCount={playerCount}
    //                   />                      
    //                 </div>
    //               )}
    //             </Draggable>
    //             {provided.placeholder}
    //           </div>
    //         )}
    //       </Droppable>
    //     ))}
    //   </div>
    // </DragDropContext>
  );
};

export default SittingOrder;