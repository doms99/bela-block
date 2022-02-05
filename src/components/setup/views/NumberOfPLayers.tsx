import React from 'react';
import Players2 from '../../icons/Players2';
import Players3 from '../../icons/Players3';
import Players4 from '../../icons/Players4';

export interface Props {
  value: number,
  setValue: (num: number) => void
}

const NumberOfPLayers: React.FC<Props> = ({ value, setValue }) => {
  return (
    <section className="w-full md:w-auto md:ml-4 grid grid-cols-3 md:grid-cols-none md:grid-rows-3 z-50">
      <button
        key={2}
        className={`mt-auto md:mt-0 md:w-full font-bold text-2xl ${value === 2 ? "text-black" : "text-primary-active"} md:row-start-1`}
        onClick={() => setValue(2)}
      >
        <Players2 className="w-11 m-auto" />
        <span>2 players</span>
      </button>
      <button
        key={3}
        className={`mt-auto md:mt-0 font-bold text-2xl ${value === 3 ? "text-black" : "text-primary-active"} md:row-start-2`}
        onClick={() => setValue(3)}
      >
        <Players3 className="w-16 m-auto" />
        <span>3 players</span>
      </button>
      <button
        key={4}
        className={`mt-auto md:mt-0 font-bold text-2xl ${value === 4 ? "text-black" : "text-primary-active"} md:row-start-3`}
        onClick={() => setValue(4)}
      >
        <Players4 className="w-16 m-auto" />
        <span>4 players</span>
      </button>
      <div className={`rounded-indicator bg-primary col-start-${value-1} md:col-start-2 md:row-start-${value-1}`} />
    </section>
  );
};

export default React.memo(NumberOfPLayers);