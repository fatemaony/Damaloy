import React from 'react'
import logoImage from '../../assets/logo.png'
import { Link } from 'react-router'

const Logo = () => {
  return (
    <div>
      <Link to={'/'}>
      <div className='flex justify-center items-center'>
        <img className='w-10 h-11' src={logoImage} alt="Logo" />
      <h1 className='font-extrabold text-[#216541] text-2xl'>Damaloy</h1>
      </div>
      </Link>
    </div>
  )
}

export default Logo