import React, {useEffect, useRef} from 'react';
import {MatterScene} from "./styles";
import Matter from "matter-js";

const Engine = Matter.Engine
const Runner = Matter.Runner
const Render = Matter.Render
const World = Matter.World
const Bodies = Matter.Bodies
const Body = Matter.Body
const Events = Matter.Events
const Query = Matter.Query

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
  const engine = useRef(null);
  const render = useRef(null);
  const runner = useRef(null);

  const windRefs = useRef(null);

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

    /** Environment */
    const jumpPad = await loadSvg("skocznia.svg",30)
    const slide = Bodies.fromVertices(447,604,jumpPad,{
      isStatic: true,
      render: {
        fillStyle: '#d2aa55'
      }
    })
    Body.scale(slide,1.5,1.5)
    slide.friction = 0.2;
    /** */

    /** Force triggers */
    const wind1 = Bodies.rectangle(365,360,150,720,{
      isSensor: true,
      isStatic: true,
      render: {
        fillStyle: '#66a0de55'
      }
    })

    const wind2 = Bodies.rectangle(515,360,150,720,{
      isSensor: true,
      isStatic: true,
      render: {
        fillStyle: '#88b0ed55'
      }
    })

    const wind3 = Bodies.rectangle(665,360,150,720,{
      isSensor: true,
      isStatic: true,
      render: {
        fillStyle: '#a0c0f055'
      }
    })

    windRefs.current = [wind1, wind2, wind3];
    /** */

    World.add(engine.current.world, [slide, wind1,wind2,wind3])
    runner.current = Runner.create();
    Runner.run(runner.current,engine.current)
    Render.run(render.current)
  }, [])

  const handleClick = async (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    console.log({x, y})

    const jumperVerts = await loadSvg("skoczek.svg",30);
    const jumper = Bodies.fromVertices(x,y,jumperVerts,{},false,0.000001,0.00001);
    Body.scale(jumper,2,2)
    jumper.friction = 0.008;
    jumper.airFriction = 3;
    Matter.World.add(engine.current.world, jumper)

    Events.on(runner.current, "tick", ()=>{
      const collisions = Query.collides(jumper, windRefs.current)
      collisions.forEach(collision => {
        if(collision.bodyA.id === windRefs.current[0].id){
          Body.applyForce(jumper,jumper.position, {x:-0.000008/collisions.length, y:-0.0001/collisions.length})
        }
        if(collision.bodyA.id === windRefs.current[1].id){
          Body.applyForce(jumper,jumper.position, {x:0.00002/collisions.length, y:-0.00005/collisions.length})
        }
        if(collision.bodyA.id === windRefs.current[2].id){
          Body.applyForce(jumper,jumper.position, {x:0.00003/collisions.length, y:-0.00013/collisions.length})
        }
      })
      // if(Query.collides(jumper, [windRefs.current[0]][0].collided)){
      //   console.log('Wind1')
      //   Body.applyForce(jumper,jumper.position, {x:3, y:1})
      // }
      // if(Query.collides(jumper, [windRefs.current[1]][0].collided)){
      //   console.log('Wind2')
      //   Body.applyForce(jumper,jumper.position, {x:1, y:5})
      //
      // }
      // if(Query.collides(jumper, [windRefs.current[2]][0].collided)){
      //   console.log('Wind3')
      //   Body.applyForce(jumper,jumper.position, {x:-8, y:-8})
      // }
    })
  }

  return (
    <MatterScene ref={boxRef} onClick={handleClick}>
      <canvas ref={canvasRef} />
    </MatterScene>
  )
}

export default Scene;