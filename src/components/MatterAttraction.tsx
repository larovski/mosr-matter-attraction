"use client";

import React, { useEffect, useRef, useState } from "react";
import Matter from "matter-js";
// @ts-ignore
import MatterAttractors from "matter-attractors";

require("pathseg");

export default function MatterStepThree() {
  const boxRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [constraints, setContraints] = useState({
    width: 0,
    height: 0,
  });
  const [scene, setScene] = useState<any>(null);

  const handleResize = () => {
    if (!boxRef?.current) return;
    setContraints(boxRef.current.getBoundingClientRect());
  };

  useEffect(() => {
    let Engine = Matter.Engine;
    let Runner = Matter.Runner;
    let Render = Matter.Render;
    let Composite = Matter.Composite;
    let Bodies = Matter.Bodies;
    let Events = Matter.Events;
    let Body = Matter.Body;
    let Mouse = Matter.Mouse;
    let MouseConstraint = Matter.MouseConstraint;
    let Common = Matter.Common;

    Common.setDecomp(require("poly-decomp"));
    Matter.use(MatterAttractors);

    let engine = Engine.create({
      gravity: {
        x: 0,
        y: 0,
      },
    });

    let render = Render.create({
      element: boxRef.current as HTMLElement,
      engine: engine as any,
      canvas: canvasRef.current as HTMLCanvasElement,
      options: {
        background: "transparent",
        wireframes: false,
      },
    });

    const gravityButton = Bodies.circle(
      window.innerWidth / 2,
      window.innerHeight / 2,
      125,
      {
        isStatic: true,
        render: {
          fillStyle: "#151226",
        },
        plugin: {
          attractors: [
            function (bodyA: any, bodyB: any) {
              return {
                x: (bodyA.position.x - bodyB.position.x) * 1e-5,
                y: (bodyA.position.y - bodyB.position.y) * 1e-5,
              };
            },
          ],
        },
      }
    );

    const balls = [...Array(150)].map((_, i) => {
      return Matter.Bodies.polygon(
        Common.random(0, render.options.width),
        Common.random(0, render.options.height),
        Common.random(1, 5),
        Common.random() > 0.9 ? Common.random(25, 35) : Common.random(15, 25),
        {
          render: {
            fillStyle: "#7b71ff",
            strokeStyle: "#151226",
          },
        }
      );
    });

    // add mouse control
    var mouse = Mouse.create(render.canvas),
      mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
          stiffness: 0.2,
          render: {
            visible: false,
          },
        },
      });

    Events.on(engine, "afterUpdate", function () {
      if (!mouse.position.x) {
        return;
      }

      // smoothly move the attractor body towards the mouse
      Body.translate(gravityButton, {
        x: (mouse.position.x - gravityButton.position.x) * 0.05,
        y: (mouse.position.y - gravityButton.position.y) * 0.05,
      });
    });

    Composite.add(engine.world, [gravityButton, ...balls, mouseConstraint]);

    setTimeout(() => {
      Runner.run(engine);
      Render.run(render);
    }, 2000);

    if (!boxRef?.current) return;

    setContraints(boxRef.current.getBoundingClientRect());
    setScene(render);

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (!scene) return;
    if (constraints) {
      let { width, height } = constraints;

      // Dynamically update canvas and bounds
      scene.bounds.max.x = width;
      scene.bounds.max.y = height;
      scene.options.width = width;
      scene.options.height = height;
      scene.canvas.width = width;
      scene.canvas.height = height;
    }
  }, [scene, constraints]);

  return (
    <div ref={boxRef} className="w-full h-screen">
      <canvas ref={canvasRef} />
    </div>
  );
}
