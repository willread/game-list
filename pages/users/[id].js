
import React from 'react'
import useSWR from 'swr'
import fetch from 'isomorphic-unfetch'

import Layout from '../../components/layout'
import { useFetchUser } from '../../lib/user'

const fetcher = url => fetch(url).then(async r => await r.json())

function User() {
  const { user, loading } = useFetchUser()
  const { data, error } = useSWR('/api/list', fetcher)

  return (
    <Layout user={user} loading={loading}>
      { data ? data.games.join(', ') : 'loading' }
    </Layout>
  )
}

export default User