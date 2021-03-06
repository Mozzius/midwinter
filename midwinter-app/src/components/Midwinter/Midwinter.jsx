import React, { useState, useEffect } from 'react'
import { Switch, Route, Redirect, Link } from 'react-router-dom'

import Sidebar from '../Sidebar'
import Messages from '../Messages'
import Bar from '../Bar'
import SelectServer from '../SelectServer'
import Pill from '../Pill'
import styles from './Midwinter.module.css'
import useChat from '../../hooks/socket'
import { useChannels } from '../../hooks/network'

const Logout = ({ logout }) => {
    // log them out
    useEffect(logout, [])

    return <Redirect to="/" />
}

const Midwinter = ({ logout }) => {
    const [mode, setMode] = useState('chat')
    const [server, setServer] = useState(JSON.parse(window.localStorage.getItem('server')) || { selected: false, data: null })
    const [chat, setChat] = useState(JSON.parse(window.localStorage.getItem('currentChannel')) || null)
    const channels = useChannels(server)
    const [rooms, setRooms] = useState([])
    const socket = useChat(JSON.stringify(rooms))

    const strData = JSON.stringify(channels.data)

    useEffect(() => {
        const data = JSON.parse(strData)
        if (channels.type === 'success') {
            setRooms(data.results.map(channel => channel.id))
        }
    }, [channels.type, strData])

    const changeServer = server => {
        window.localStorage.removeItem('currentChannel')
        setChat(null)
        setServer({ selected: true, data: server })
        setMode('chat')
    }

    // runs when server changes
    useEffect(() => {
        if (server.selected) {
            window.localStorage.setItem('server', JSON.stringify(server))
        } else {
            setMode('select server')
        }
    }, [server])

    return (
        <Switch>
            <Route path={['/login', '/signup']}>
                <Redirect to="/" />
            </Route>
            <Route path="/logout">
                <Logout logout={logout} />
            </Route>
            <Route path="/">
                {mode === 'select server' ? <SelectServer setServer={changeServer} /> : (
                    <div className={styles.main}>
                        <Sidebar
                            currentChat={chat?.id}
                            setChat={setChat}
                            channels={channels}
                            server={server}
                        />
                        <div className={styles.right}>
                            <Bar text={server.data?.name}>
                                <Pill onClick={() => setMode('select server')}>
                                    Change
                            </Pill>
                                <Pill right>
                                    <Link to="/logout">Logout</Link>
                                </Pill>
                            </Bar>
                            {chat ? <Messages chat={chat} socket={socket} /> : <p>Select a channel</p>}
                        </div>
                    </div>
                )}
            </Route>
        </Switch>
    )
}

export default Midwinter