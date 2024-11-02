export default function notFound (){
    return(
        <main className="not-found">
            <div className="container">
                <div className="text">
                    <h1>Error 404</h1>
                    <h2>Pagina no encontrada</h2>
                    <p>Ops.. parece que estas perdido. No encontramos la bandeja que estabas buscando</p>
                </div>
                <a href="/menu" className="back2MenuButton">Volver al menu</a>
            </div>
        </main>
)
}