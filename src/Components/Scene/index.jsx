import React, {useEffect, useRef} from 'react';
import {MatterScene} from "./styles";
import Matter from "matter-js";
const Engine = Matter.Engine
const Runner = Matter.Runner
const Render = Matter.Render
const World = Matter.World
const Bodies = Matter.Bodies
const Body = Matter.Body

const loadSvg = function(url,sampleLength) {
  return fetch(url)
    .then(function(response) { return response.text(); })
    .then(function(raw) { return (new window.DOMParser()).parseFromString(raw, 'image/svg+xml'); })
    .then(function (raw) {
      return Array.from(raw.getElementsByTagName('path')).map((path) => Matter.Svg.pathToVertices(path,sampleLength))
    })
};

const Scene = ({props}) => {
  const boxRef = useRef(null)
  const canvasRef = useRef(null)
  const engine = useRef(null);
  const render = useRef(null);

  useEffect(async () => {
    engine.current = Engine.create({})

    render.current = Render.create({
      element: boxRef.current,
      engine: engine.current,
      canvas: canvasRef.current,
      options: {
        width: 1280,
        height: 720,
        background: 'grey',
        wireframes: false,
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
    slide.friction = 0.2;
    World.add(engine.current.world, [slide])

    const runner = Runner.create();
    Runner.run(runner,engine.current)
    Render.run(render.current)
  }, [])

  const handleClick = async (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const jumperVerts = await loadSvg("skoczek.svg",1);
    const jumper = Bodies.fromVertices(x,y,jumperVerts,{},false,0.000001,0.00001);

    jumper.friction = 0.008;
    Matter.World.add(engine.current.world, jumper)
  }

  return (
    <MatterScene ref={boxRef} onClick={handleClick}>
      <canvas ref={canvasRef} />
    </MatterScene>
  )
}

export default Scene;