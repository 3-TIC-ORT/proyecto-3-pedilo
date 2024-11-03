import React from 'react';
import "./landing.css";

function Landing() {
  return (
    <div className='body'>
      <div className="header">
        <div className="logo">
        <svg width="46" height="50" viewBox="0 0 46 50" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_266_3092)">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M19.8327 0.584077C19.3742 0.905319 18.7721 1.71543 18.4949 2.38431C17.8284 3.99413 18.5413 5.77996 20.1311 6.48365C20.8984 6.8233 21.2888 7.29096 21.2888 7.87024C21.2888 8.59113 20.8856 8.85997 18.9885 9.40444C14.7612 10.617 9.5445 14.2019 9.76533 15.7429C9.95695 17.0802 11.1339 16.981 12.9853 15.4712C15.3377 13.553 17.8264 12.328 20.8888 11.5807L23.4891 10.9466V7.77342V4.60061L22.1662 4.47339C20.7408 4.33657 20.0211 3.34204 20.9304 2.76596C21.9097 2.14588 28.3262 2.32111 28.8754 2.98279C29.5427 3.7873 29.0543 4.40058 27.7461 4.40058C26.1047 4.40058 25.6894 5.09347 25.6894 7.83223C25.6894 10.6586 25.9451 10.9882 28.4586 11.4031C29.4319 11.5635 31.5786 12.394 33.2296 13.2485C34.8806 14.1031 36.4348 14.8019 36.6829 14.8019C36.9309 14.8019 37.7446 14.1719 38.4911 13.4018C39.9633 11.8828 40.7802 11.6463 41.1575 12.6301C41.3107 13.0289 40.8686 13.801 39.9449 14.7471C39.1452 15.566 38.4911 16.409 38.4911 16.6202C38.4911 16.8318 39.114 17.8808 39.8749 18.9509C42.3344 22.4106 43.4698 27.4228 42.8317 32.0042C41.3211 42.8508 30.046 50.0378 19.6018 46.8122C16.9635 45.9973 12.8809 43.5981 11.5256 42.0667C10.5638 40.9798 9.83974 40.973 9.26606 42.0447C8.87161 42.7824 9.03883 43.0909 10.6422 44.5843C12.8089 46.6021 16.5842 48.6912 19.4358 49.4505C22.5134 50.2698 27.9133 50.1586 30.9769 49.2125C38.3955 46.921 44.1343 40.1469 45.3652 32.2286C46.0281 27.9645 45.4152 24.3948 43.2801 20.0862L41.6179 16.7322L42.428 15.8669C43.4862 14.7375 44.1335 12.9897 43.821 12.1052C42.8633 9.39284 39.8793 8.75835 37.579 10.7778L36.2388 11.9548L35.0647 11.1699C34.419 10.7386 32.6755 10.0113 31.1901 9.55446C28.8362 8.82996 28.4898 8.59993 28.4898 7.76222C28.4898 7.19615 28.7246 6.8009 29.0607 6.8009C29.9728 6.8009 31.2914 4.80543 31.2774 3.44645C31.2502 0.789705 29.7212 0 24.6045 0C21.7993 0 20.4267 0.168022 19.8327 0.584077ZM20.6888 14.5627C16.9783 15.7393 13.5154 18.2108 13.7643 19.505C13.9927 20.6891 15.1096 20.5003 17.6696 18.8461C23.1391 15.3108 28.9411 15.7989 33.6345 20.1891C36.3976 22.7734 37.4678 25.3377 37.481 29.4039C37.4894 32.1062 37.3178 32.9567 36.3788 34.869C34.2201 39.2648 30.5237 41.6431 25.4134 41.9235C22.375 42.0903 21.9533 42.0135 19.6126 40.8674C18.224 40.1877 16.6074 39.2408 16.0194 38.7635C14.7372 37.7222 13.5726 37.993 13.7599 39.2892C13.9395 40.5349 17.4523 43.0901 20.0887 43.8922C21.3437 44.2738 23.6123 44.5587 25.369 44.5547C28.1069 44.5487 28.7814 44.3834 31.4438 43.0677C34.8562 41.3811 37.0713 39.1444 38.7859 35.6543C39.7693 33.6528 39.8913 32.9627 39.8913 29.4039C39.8913 25.9078 39.7569 25.1169 38.8272 23.133C37.5566 20.4231 34.9846 17.5255 32.6191 16.1393C29.2039 14.1379 24.1396 13.4686 20.6888 14.5627ZM0.628922 22.2081C0.0752492 23.6507 1.1866 24.0032 6.28687 24.0032C11.3975 24.0032 12.4021 23.6875 11.8516 22.2537C11.4916 21.3152 0.987769 21.2724 0.628922 22.2081ZM28.577 23.7139C27.048 25.2725 26.7508 25.4113 25.253 25.2685C22.4246 24.9989 20.4887 26.7687 20.4887 29.6239C20.4887 31.5466 22.7154 33.6044 24.7953 33.6044C27.5673 33.6044 29.5391 31.0889 28.9959 28.2461C28.8338 27.3976 29.1575 26.8003 30.6377 25.2177C31.8194 23.9548 32.3963 23.023 32.2431 22.6246C31.8134 21.5044 30.306 21.9525 28.577 23.7139ZM4.16659 28.0837C3.4657 28.7846 3.57851 29.5179 4.46023 29.9899C4.88588 30.2176 7.21339 30.404 9.63251 30.404C13.095 30.404 14.1643 30.2704 14.6588 29.7763C15.1324 29.3023 15.1852 28.959 14.8732 28.3761C14.4992 27.6772 13.9915 27.6036 9.5533 27.6036C6.27047 27.6036 4.48783 27.7625 4.16659 28.0837ZM26.0095 28.0837C26.8644 28.9386 26.5735 30.3828 25.4426 30.8981C24.5181 31.3193 24.3068 31.2661 23.6424 30.4452C22.7266 29.3147 22.711 29.039 23.5175 28.2321C24.2664 27.4836 25.345 27.4192 26.0095 28.0837ZM0.928161 34.5538C0.677328 34.8562 0.584516 35.3963 0.722134 35.7539C0.935362 36.31 1.74747 36.4048 6.28687 36.4048C10.8263 36.4048 11.6384 36.31 11.8516 35.7539C12.4021 34.3201 11.3975 34.0045 6.28687 34.0045C2.61798 34.0045 1.26941 34.1429 0.928161 34.5538Z" fill="#fff"/>
            </g>
            <defs>
                <clipPath id="clip0_266_3092">
                    <rect width="45.1194" height="50" fill="white" transform="translate(0.5)"/>
                </clipPath>
            </defs>
        </svg>
        </div>
        <div className="buttons">
           <a href="#inicio">Inicio</a>
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
      <section id='timi'>
        <div className="leftSide">
            <div className="title">
                <h1>T.I.M.I</h1>
                <p>Nicolás Krymkiewicz</p>
            </div>
            <div className="aplicacionesUsadas">
                <div className="aplicacion">
                    <img src="/images/landing/logo-googleDrive.svg" alt="" />
                </div>
                <div className="aplicacion black">
                    <img src="/images/landing/logo-figma.svg" alt="" />
                </div>
                <div className="aplicacion">
                    <img src="/images/landing/logo-behance.svg" alt="" />
                </div>
                <div className="aplicacion">
                    <img src="/images/landing/logo-coolors.svg" alt="" />
                </div>
                <div className="aplicacion black">
                    <img src="/images/landing/logo-chatgpt.svg" alt=""/>
                </div>
                <div className="aplicacion">
                    <img src="/images/landing/logo-looka.svg" alt=""/>
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
                <h1>T.I.M.I</h1>
                <p>Nicolás Krymkiewicz</p>
            </div>
            <div className="aplicacionesUsadas">
                <div className="aplicacion">
                    <img src="/images/landing/logo-googleDrive.svg" alt="" />
                </div>
                <div className="aplicacion black">
                    <img src="/images/landing/logo-figma.svg" alt="" />
                </div>
                <div className="aplicacion">
                    <img src="/images/landing/logo-behance.svg" alt="" />
                </div>
                <div className="aplicacion">
                    <img src="/images/landing/logo-coolors.svg" alt="" />
                </div>
                <div className="aplicacion black">
                    <img src="/images/landing/logo-chatgpt.svg" alt=""/>
                </div>
                <div className="aplicacion">
                    <img src="/images/landing/logo-looka.svg" alt=""/>
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
    </div>
  )
}

export default Landing
