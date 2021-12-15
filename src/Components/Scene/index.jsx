import React, {useEffect, useRef} from 'react';
import {MatterScene} from "./styles";
import Matter from "matter-js";

function Scene(props){
  const boxRef = useRef(null)
  const canvasRef = useRef(null)

  const vertices = useRef([]);

  useEffect(() => {
    let Engine = Matter.Engine
    let Render = Matter.Render
    let World = Matter.World
    let Bodies = Matter.Bodies

    let engine = Engine.create({})

    let render = Render.create({
      element: boxRef.current,
      engine: engine,
      canvas: canvasRef.current,
      options: {
        width: 700,
        height: 700,
        background: 'black',
        wireframes: false,
      },
    })

    const floor = Bodies.rectangle(350, 700, 700, 5, {
      isStatic: true,
      render: {
        fillStyle: 'white',
      },
    })

    const ball = Bodies.circle(150, 0, 10, {
      restitution: 0.9,
      render: {
        fillStyle: 'white',
      },
    })

    World.add(engine.world, [floor, ball])

    Engine.run(engine)
    Render.run(render)
  }, [])

  const handleClick = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    vertices.current.push({x,y});
    console.log(vertices.current)
  }

  return (
    <MatterScene ref={boxRef} onClick={handleClick}>
      <canvas ref={canvasRef} />
    </MatterScene>
  )
}

export default Scene;