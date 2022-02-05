import { gql, useQuery } from '@apollo/client'
import { getCookie } from 'cookies-next'
import { NextFetchEvent, NextRequest, NextResponse } from 'next/server'
import { links } from '../../util/route-links'
import UserSession from '../../util/user-session'

export function middleware(req: NextRequest, ev: NextFetchEvent) {
  if (!req.cookies['token']) {
    return NextResponse.redirect('/auth/login')
  }
}
