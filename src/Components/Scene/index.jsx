import React, {useEffect, useRef} from 'react';
import {MatterScene} from "./styles";
import Matter from "matter-js";

const loadSvg = function(url,sampleLength) {
  return fetch(url)
    .then(function(response) { return response.text(); })
    .then(function(raw) { return (new window.DOMParser()).parseFromString(raw, 'image/svg+xml'); })
    .then(function (raw) {
      return Array.from(raw.getElementsByTagName('path')).map((path) => Matter.Svg.pathToVertices(path,sampleLength))
    })
};

const Scene = (props) => {
  const boxRef = useRef(null)
  const canvasRef = useRef(null)

  const vertices = useRef([]);

  useEffect(async () => {
    let Engine = Matter.Engine
    let Render = Matter.Render
    let World = Matter.World
    let Bodies = Matter.Bodies
    let Body = Matter.Body

    let engine = Engine.create({})

    let render = Render.create({
      element: boxRef.current,
      engine: engine,
      canvas: canvasRef.current,
      options: {
        width: 1280,
        height: 720,
        background: 'grey',
        wireframes: false,
      },
    })

    const ball = Bodies.circle(284, 427, 3, {
      restitution: 0.9,
      render: {
        fillStyle: 'red',
      },
    })

    const jumpPad = await loadSvg("skocznia.svg",15)
    const slide = Bodies.fromVertices(385,595,jumpPad,{
      isStatic: true,
      render: {
        fillStyle: '#d2aa5555'
      }
    })
    Body.scale(slide,1.5,1.5)

    World.add(engine.world, [slide,ball])

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