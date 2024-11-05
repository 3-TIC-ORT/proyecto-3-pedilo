import "./landing.css";
import { checkAccess } from '@/lib/auth-utils';

async function Landing() {
  await checkAccess('/landing');
  return (
    <div className='body'>
      <div className="header">
        <div className="logo">
          <img src="/images/logoWhite.svg" alt="" />
        </div>
        <div className="buttons">
          <a href="#inicio">Inicio</a>
          <a href="#videosDemo">Videos</a>
          <a href="#timi">Timi</a>
          <a href="#frontend">Frontend</a>
          <a href="#backend">Backend</a>
        </div>
      </div>
      <section className='inicio' id='inicio'>
        <div className="title">
          <h1>Pedilo</h1>
          <p>.tech</p>
        </div>
        <a href='#timi' className="scrollButton">
          <img src="/media/arrowDown.svg" alt="" />
        </a>
      </section>
      <section id="videosDemo">
        <div className="videoContainer">
          <h1>Usuario</h1>
          <video src="/videos/landing/videoDemo1.mp4" autoPlay loop muted></video>
        </div>
        <div className="videoContainer">
          <h1>Mozo</h1>
          <video src="/videos/landing/videoDemo2.mp4" autoPlay loop muted></video>
        </div>
        <div className="videoContainer">
          <h1>Cocina</h1>
          <video src="/videos/landing/videoDemo3.mp4" autoPlay loop muted></video>
        </div>
      </section>
      <section id='timi'>
        <div className="leftSide">
          <div className="title">
            <h1>T.I.M.I</h1>
            <p>Nicolás Krymkiewicz</p>
          </div>
          <div className="aplicacionesUsadas">
            <div className="aplicacion black">
              <p className="imgText">Figma</p>
              <img src="/images/landing/logo-figma.svg" alt="" />
            </div>
            <div className="aplicacion">
              <p className="imgText">Notion</p>
              <img src="/images/landing/logo-notion.svg" alt="" />
            </div>
            <div className="aplicacion">
              <p className="imgText">Google Drive</p>
              <img src="/images/landing/logo-googleDrive.svg" alt="" />
            </div>
            <div className="aplicacion">
              <p className="imgText">Youtube</p>
              <img src="/images/landing/logo-youtube.svg" alt="" />
            </div>
            <div className="aplicacion">
              <p className="imgText">Behance</p>
              <img src="/images/landing/logo-behance.svg" alt="" />
            </div>
            <div className="aplicacion">
              <p className="imgText">Coolors</p>
              <img src="/images/landing/logo-coolors.svg" alt="" />
            </div>
            <div className="aplicacion black">
              <p className="imgText">Chatgpt</p>
              <img src="/images/landing/logo-chatgpt.svg" alt="" />
            </div>
            <div className="aplicacion">
              <p className="imgText">Looka</p>
              <img src="/images/landing/logo-looka.svg" alt="" />
            </div>
          </div>
        </div>
        <div className="rightSide">
          <div className="etapa">
            <div className="text">
              <h1>Etapa 1</h1>
              <p>Wireframes v1</p>
            </div>
            <div className="content">
              <div className="img">
                <img src="/images/landing/timi-etapa-1-img-1.png" alt="" />
              </div>
              <div className="img">
                <img src="/images/landing/timi-etapa-1-img-2.png" alt="" />
              </div>
              <div className="img">
                <img src="/images/landing/timi-etapa-1-img-3.png" alt="" />
              </div>
            </div>
          </div>
          <div className="etapa">
            <div className="text">
              <h1>Etapa 2</h1>
              <p>Wireframes v2</p>
            </div>
            <div className="content type1">
              <div className="img">
                <img src="/images/landing/timi-etapa-2-img-1.png" alt="" />
              </div>
              <div className="img">
                <img src="/images/landing/timi-etapa-2-img-2.png" alt="" />
              </div>
              <div className="img">
                <img src="/images/landing/timi-etapa-2-img-3.png" alt="" />
              </div>
            </div>
          </div>
          <div className="etapa">
            <div className="text">
              <h1>Etapa 3</h1>
              <p>Referentes Visuales</p>
            </div>
            <div className="content">
              <div className="img">
                <img src="/images/landing/timi-etapa-3-img-1.png" alt="" />
              </div>
              <div className="img">
                <img src="/images/landing/timi-etapa-3-img-2.png" alt="" />
              </div>
              <div className="img">
                <img src="/images/landing/timi-etapa-3-img-3.png" alt="" />
              </div>
              <div className="img">
                <img src="/images/landing/timi-etapa-3-img-4.png" alt="" />
              </div>
            </div>
          </div>
          <div className="etapa">
            <div className="text">
              <h1>Etapa 4</h1>
              <p>Componentes en Figma</p>
            </div>
            <div className="content type2">
              <div className="img">
                <img src="/images/landing/timi-etapa-4-img-1.png" alt="" />
              </div>
              <div className="img">
                <img src="/images/landing/timi-etapa-4-img-2.png" alt="" />
              </div>
              <div className="img">
                <img src="/images/landing/timi-etapa-4-img-3.png" alt="" />
              </div>
            </div>
          </div>
          <div className="etapa">
            <div className="text">
              <h1>Etapa 5</h1>
              <p>Diseño Final</p>
            </div>
            <div className="content">
              <div className="img">
                <img src="/images/landing/timi-etapa-5-img-1.png" alt="" />
              </div>
              <div className="img">
                <img src="/images/landing/timi-etapa-5-img-2.png" alt="" />
              </div>
              <div className="img">
                <img src="/images/landing/timi-etapa-5-img-3.png" alt="" />
              </div>
              <div className="img">
                <img src="/images/landing/timi-etapa-5-img-4.png" alt="" />
              </div>
            </div>
          </div>
          <div className="etapa">
            <div className="text">
              <h1>Etapa 6</h1>
              <p>Naming y Logo</p>
            </div>
            <div className="content type3">
              <div className="img">
                <img src="/images/landing/timi-etapa-6-img-1.png" alt="" />
              </div>
              <div className="img">
                <img src="/images/landing/timi-etapa-6-img-2.png" alt="" />
              </div>
              <div className="img">
                <img src="/images/landing/timi-etapa-6-img-3.png" alt="" />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id='frontend'>
        <div className="leftSide">
          <div className="title">
            <h1>Frontend</h1>
            <p>
              Oliver Jones &
              <br />
              Eitan Feldman
            </p>
          </div>
          <div className="aplicacionesUsadas">
            <div className="aplicacion black">
              <p className="imgText">VsCode</p>
              <img src="/images/landing/logo-vscode.svg" alt="" />
            </div>
            <div className="aplicacion">
              <p className="imgText">Notion</p>
              <img src="/images/landing/logo-notion.svg" alt="" />
            </div>
            <div className="aplicacion">
              <p className="imgText">Google Drive</p>
              <img src="/images/landing/logo-googleDrive.svg" alt="" />
            </div>
            <div className="aplicacion">
              <p className="imgText">Stack Overflow</p>
              <img src="/images/landing/logo-stackoverflow.svg" alt="" />
            </div>
            <div className="aplicacion">
              <p className="imgText">Youtube</p>
              <img src="/images/landing/logo-youtube.svg" alt="" />
            </div>
            <div className="aplicacion black">
              <p className="imgText">Chatgpt</p>
              <img src="/images/landing/logo-chatgpt.svg" alt="" />
            </div>
            <div className="aplicacion">
              <p className="imgText">Github Copilot</p>
              <img src="/images/landing/logo-githubCopilot.svg" alt="" />
            </div>
            <div className="aplicacion">
              <p className="imgText">v0.Dev</p>
              <img src="/images/landing/logo-v0dev.svg" alt="" />
            </div>
            <div className="aplicacion black">
              <p className="imgText">Claude</p>
              <img src="/images/landing/logo-claude.svg" alt="" />
            </div>
            <div className="aplicacion black">
              <p className="imgText">React</p>
              <img src="/images/landing/logo-react.svg" alt="" />
            </div>
          </div>
        </div>
        <div className="rightSide">
          <div className="etapa textOnly">
            <h1>Problemas</h1>
            <div className="text">
              <h1>Problema 1</h1>
              <p>Problemas en el orden</p>
            </div>
            <div className="text">
              <h1>Problema 2</h1>
              <p>Problemas con el diseñador que tardó</p>
            </div>
            <div className="text">
              <h1>Problema 3</h1>
              <p>Problema con React!!!</p>
            </div>
          </div>
          <div className="etapa textOnly">
            <h1>React</h1>
            <div className="text">
              <h1>Etapa 1</h1>
              <p>¿Que es, para qué sirve y qué cosas distintas al resto tiene?</p>
            </div>
            <div className="text">
              <h1>Etapa 2</h1>
              <p>Empezar a programar los wireframes que nos mandaba el diseñador.</p>
            </div>
            <div className="text">
              <h1>Etapa 3</h1>
              <p>Programar el diseño final</p>
            </div>
          </div>
        </div>
      </section>
      <section id='backend'>
        <div className="leftSide">
          <div className="title">
            <h1>Backend</h1>
            <p>Simon Mersich</p>
          </div>
          <div className="aplicacionesUsadas">
            <div className="aplicacion">
              <p className="imgText">Notion</p>
              <img src="/images/landing/logo-notion.svg" alt="" />
            </div>
            <div className="aplicacion">
              <p className="imgText">Google Drive</p>
              <img src="/images/landing/logo-googleDrive.svg" alt="" />
            </div>
            <div className="aplicacion">
              <p className="imgText">Stack Overflow</p>
              <img src="/images/landing/logo-stackoverflow.svg" alt="" />
            </div>
            <div className="aplicacion">
              <p className="imgText">Youtube</p>
              <img src="/images/landing/logo-youtube.svg" alt="" />
            </div>
            <div className="aplicacion black">
              <p className="imgText">Chatgpt</p>
              <img src="/images/landing/logo-chatgpt.svg" alt="" />
            </div>
            <div className="aplicacion">
              <p className="imgText">Github Copilot</p>
              <img src="/images/landing/logo-githubCopilot.svg" alt="" />
            </div>
            <div className="aplicacion black">
              <p className="imgText">Claude</p>
              <img src="/images/landing/logo-claude.svg" alt="" />
            </div>
            <div className="aplicacion black">
              <p className="imgText">React</p>
              <img src="/images/landing/logo-react.svg" alt="" />
            </div>
            <div className="aplicacion">
              <p className="imgText">NextJs</p>
              <img src="/images/landing/logo-nextjs.svg" alt="" />
            </div>
            <div className="aplicacion black">
              <p className="imgText">Typescript</p>
              <img src="/images/landing/logo-typescript.svg" alt="" />
            </div>
            <div className="aplicacion">
              <p className="imgText">Prisma</p>
              <img src="/images/landing/logo-prisma.svg" alt="" />
            </div>
            <div className="aplicacion black">
              <p className="imgText">Authjs</p>
              <img src="/images/landing/logo-authjs.svg" alt="" />
            </div>
            <div className="aplicacion black">
              <p className="imgText">Postgresql</p>
              <img src="/images/landing/logo-postgresql.svg" alt="" />
            </div>
            <div className="aplicacion">
              <p className="imgText">Vercel</p>
              <img src="/images/landing/logo-vercel.svg" alt="" />
            </div>
          </div>
        </div>
        <div className="rightSide">
          <div className="etapa textOnly">
            <h1>Etapas</h1>
            <div className="text">
              <h1>Etapa 1</h1>
              <p>Hacer el esquema de la base de datos</p>
            </div>
            <div className="text">
              <h1>Etapa 2</h1>
              <p>Decidir que framework usar</p>
            </div>
            <div className="text">
              <h1>Etapa 3</h1>
              <p>Pasar de api routes a server actions</p>
            </div>
          </div>
          <div className="etapa textOnly">
            <h1>Problemas</h1>
            <div className="text">
              <h1>Problema 1</h1>
              <p>Base de datos de SQLite a PostgreSQL</p>
            </div>
            <div className="text">
              <h1>Problema 2</h1>
              <p>Middleware</p>
            </div>
            <div className="text">
              <h1>Problema 3</h1>
              <p>Websockets con vercel</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Landing
