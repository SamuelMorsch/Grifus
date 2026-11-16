
import './ServerSidebar.css'
import { useState } from 'react'

function ServerSidebar({
    servidores,
    servidorSelecionado,
    setServidorSelecionado,
    criarServidor,
    abrirGerenciamento
}) {
    const [menuServidor, setMenuServidor] = useState(null)

    function abrirMenu(e, servidor) {
        e.preventDefault()

        setMenuServidor({
            id: servidor.id,
            x: e.clientX,
            y: e.clientY
        })
    }

    const servidorDoMenu = servidores.find(
        (servidor) => servidor.id === menuServidor?.id
    )

    return (
        <aside className="server-sidebar">
            <div className="server-logo">
                d
            </div>

            {servidores.map((servidor) => (
                <button
                    key={servidor.id}
                    className={
                        servidorSelecionado === servidor.id
                            ? 'server-button selected'
                            : 'server-button'
                    }
                    onClick={() => {
                        setServidorSelecionado(servidor.id)
                        setMenuServidor(null)
                    }}
                    onContextMenu={(e) => abrirMenu(e, servidor)}
                    title={servidor.nome}
                >
                    <span
                        className={
                            servidorSelecionado === servidor.id
                                ? 'button-barra selected'
                                : 'button-barra'
                        }
                    />

                    {servidor.imagem ? (
                        <img
                            className="server-image"
                            src={servidor.imagem}
                            alt={servidor.nome}
                        />
                    ) : (
                        servidor.nome[0]
                    )}
                </button>
            ))}

            <button
                className="server-button add-server-button"
                onClick={criarServidor}
                title="Criar servidor"
            >
                +
            </button>

            {menuServidor && servidorDoMenu && (
                <div
                    className="server-context-menu"
                    style={{
                        left: menuServidor.x,
                        top: menuServidor.y
                    }}
                    onMouseLeave={() => setMenuServidor(null)}
                >
                    <button
                        onClick={() => {
                            abrirGerenciamento({
                                tipo: 'servidor',
                                acao: 'renomear',
                                id: servidorDoMenu.id,
                                nome: servidorDoMenu.nome
                            })
                            setMenuServidor(null)
                        }}
                    >
                        Renomear servidor
                    </button>

                    {servidores.length > 1 && (
                        <button
                            className="context-delete"
                            onClick={() => {
                                abrirGerenciamento({
                                    tipo: 'servidor',
                                    acao: 'excluir',
                                    id: servidorDoMenu.id,
                                    nome: servidorDoMenu.nome
                                })
                                setMenuServidor(null)
                            }}
                        >
                            Excluir servidor
                        </button>
                    )}
                </div>
            )}
        </aside>
    )
}

export default ServerSidebar
