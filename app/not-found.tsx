import "./not-found.css"

export default function notFound (){
    return(
        <main className="text-left">
         <h2 className="text-3xl">Error 404</h2>
         <p>Te pedimos mil disculpas, hubo un problema en la aplicacion</p>
         <p>Para reslverlo, chequeá que estés bien conectado a la red de internet</p>
         <p>Volver al <a href="/menu">menu</a></p>
        </main>
)
}