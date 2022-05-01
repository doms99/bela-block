import { animated, useSpring } from '@react-spring/web';
import React, { useLayoutEffect, useRef } from 'react';

export type Props = {
  divisions: number,
  value: number,
  className?: string
}

const Slider: React.FC<Props> = ({ children, divisions, value, className }) => {
  const prevVal = useRef<number>(value);
  const [props, animate] = useSpring(() => ({ marginLeft: `${(value - 1) * 100/divisions}%` }))

  useLayoutEffect(() => {
    console.log(prevVal.current, value);
    if(prevVal.current === value) return;

    animate.start({ marginLeft: `${(value - 1) * 100/divisions}%` });

    prevVal.current = value;
  }, [animate, value, divisions]);

  return (
    <animated.div style={props} className={`${className} w-1/${divisions}`}>{children}</animated.div>
  )
}

export default Slider