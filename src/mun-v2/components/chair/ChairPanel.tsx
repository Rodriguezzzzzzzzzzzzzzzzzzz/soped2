import React from 'react'

type Props = {
  committeeId: string
}

export default function ChairPanel({ committeeId }: Props) {
  return (
    <div>
      <h1>Chair Panel</h1>
      <p>Committee: {committeeId}</p>
    </div>
  )
}