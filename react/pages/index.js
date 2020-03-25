
import React from 'react'

import Layout from '../components/layout'
import { useFetchUser } from '../lib/user'

function Home() {
  const { user, loading } = useFetchUser()

  return (
    <Layout user={user} loading={loading}>

    </Layout>
  )
}

export default Home