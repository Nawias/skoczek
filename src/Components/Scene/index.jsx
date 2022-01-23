import React, {useEffect, useRef} from 'react';
import {MatterScene, StartButton} from "./styles";
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

const Scene = ({
    initialSpeed= 16,
    jumpForce= 0.7,
    mass = 120,
    windVector1 = {x:-0.02,y:-0.03},
    windVector2 = {x:0,y:-0.01},
    windVector3 = {x:0.02,y:0.015}
  }) => {
  const boxRef = useRef(null)
  const canvasRef = useRef(null)
  const engine = useRef(null);
  const render = useRef(null);
  const runner = useRef(null);
  const jumperRef = useRef(null);

  const windRefs = useRef(null);

  function setupJumper() {
    let jumper = Bodies.trapezoid(280,790,42,30,0.8);
    jumper.position = {x:280,y:790}
    jumper.friction = 0.001;
    jumper.airFriction = 10;
    jumper.mass = mass;
    Body.setVelocity(jumper, {x: initialSpeed, y: 0});
    Body.applyForce(jumper, jumper.position, {x: 0, y: -jumpForce})
    return jumper;
  }

  useEffect(async () => {
    engine.current = Engine.create({})
    engine.current.timing.timeScale = 1
    render.current = Render.create({
      element: boxRef.current,
      engine: engine.current,
      canvas: canvasRef.current,
      options: {
        width: 1280,
        height: 720,
        background: 'grey',
        wireframes: false,
        hasBounds:true,
      },
    })
    runner.current = Runner.create();

    /** Environment */
    const jumpPad = await loadSvg("skocznia.svg",30)
    const slide = Bodies.fromVertices(630,1180,jumpPad,{
      isStatic: true,
      render: {
        fillStyle: '#d2aa55'
      }
    })
    Body.scale(slide,3.5,3.5)
    slide.friction = 0.2;
    /** */

    /** Force triggers */
    const wind1 = Bodies.rectangle(515,720,300,1440,{
      isSensor: true,
      isStatic: true,
      render: {
        fillStyle: '#66a0de55'
      }
    })

    const wind2 = Bodies.rectangle(815,720,300,1440,{
      isSensor: true,
      isStatic: true,
      render: {
        fillStyle: '#88b0ed55'
      }
    })

    const wind3 = Bodies.rectangle(1115,720,300,1440,{
      isSensor: true,
      isStatic: true,
      render: {
        fillStyle: '#a0c0f055'
      }
    })

    windRefs.current = [wind1, wind2, wind3];
    /** */

    jumperRef.current = setupJumper();
    const jumper = jumperRef.current;


    World.add(engine.current.world, [slide, wind1,wind2,wind3,jumperRef.current])

    Render.run(render.current)

    Render.lookAt(render.current,{x:1200,y:550}, {x:1600,y:900},);

    Events.on(runner.current, "tick", ()=>{
      const collisions = Query.collides(jumper, windRefs.current)
      collisions.forEach(collision => {
        if(collision.bodyA.id === windRefs.current[0].id){
          //{x:-0.00008, y:-0.001}
          Body.applyForce(jumper,jumper.position, {x:windVector1.x/collisions.length, y:windVector1.y/collisions.length})
        }
        if(collision.bodyA.id === windRefs.current[1].id){
          //{x:0.0002, y:-0.0005}
          Body.applyForce(jumper,jumper.position, {x:windVector2.x/collisions.length, y:windVector2.y/collisions.length})
        }
        if(collision.bodyA.id === windRefs.current[2].id){
          //{x:0.0003, y:-0.0013}
          Body.applyForce(jumper,jumper.position, {x:windVector3.x/collisions.length, y:windVector3.y/collisions.length})
        }
      })
    })
    return () => {
      Matter.Runner.stop(runner.current);
      Matter.Render.stop(render.current);

      render.canvas.remove();
      render.canvas = null;
      render.context = null;
      render.textures = {};

      Matter.World.clear(engine.current.world);
      Matter.Engine.clear(engine.current);
    }
  }, [initialSpeed,jumpForce,mass,windVector1,windVector2,windVector3])

  return (
    <>
      <MatterScene ref={boxRef}>
        <canvas ref={canvasRef} />
      </MatterScene>
      <StartButton onClick={()=>{
        if(runner.current.enabled) {
          Runner.stop(runner.current)
          World.remove(engine.current.world, jumperRef.current)
          jumperRef.current = setupJumper();
          World.add(engine.current.world, jumperRef.current);
        }
        Runner.start(runner.current,engine.current)
      }} >RUN</StartButton>
    </>
  )
}

export default Scene;