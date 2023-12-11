import { useSelector } from 'react-redux'
import { useFetchCurrentUserQuery } from '../services/userApi'
import { useHistory, useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useCallback, useState } from 'react'


const useBounceUsers = () => {
  const { data: userData, error: userError, isLoading: userIsLoading } = useFetchCurrentUserQuery()
    const history = useHistory()
    const { pathname } = useLocation()

    const bounce = useCallback(() => {
        if (!userData) {
            history.replace('/register')
        } else if (pathname === '/register') {
            history.replace('/')
        } else {
            history.replace(pathname)
        }
    }, [userData, pathname, history])

    return [bounce]
}

export default useBounceUsers