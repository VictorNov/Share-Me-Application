import React, {useState, useEffect} from 'react'
import {AiOutlineLogout} from 'react-icons/ai'
import {useParams, useNavigate} from 'react-router-dom'
import GoogleLogin, {GoogleLogout} from 'react-google-login'

import {userCreatedPinsQuery, userQuery, userSavedPinsQuery} from '../utils/data'
import {client} from '../client'
import MasonryLayout from './MasonryLayout'
import Spinner from './Spinner'
import { FcGoogle } from 'react-icons/fc'
import logo from '../assets/logowhite.png'

const randomImage = 'https://source.unsplash.com/1600x900/?nature,photography,technology'

const activeBtnStyles = 'bg-red-500 text-white font-bold p-2 rounded-full outline-none'
const notActiveBtnStyles = 'bg-primary text-black font-bold p-2 rounded-full outline-none'

const UserProfile = () => {
  const [user, setUser] = useState(null)
  const [pins, setPins] = useState(null)
  const [text, setText] = useState('Созданные')
  const [activeBtn, setActiveBtn] = useState('created')

  const navigate = useNavigate()
  const {userId} = useParams()

  useEffect(() => {
    const query = userQuery(userId)

    client.fetch(query)
      .then(data => {
        setUser(data[0])
      })
      .catch(error => console.log("Fetching user error: ", error))
  }, [userId])

  useEffect(() => {
    if (text === 'Созданные') {
      const query = userCreatedPinsQuery(userId)

      client.fetch(query)
        .then(data => {
          setPins(data)
        })
    } else {
      const query = userSavedPinsQuery(userId)

      client.fetch(query)
        .then(data => {
          setPins(data)
        })
    }
  }, [text, userId])

  const logout = () => {
    localStorage.clear()

    navigate('/login')
  }

  if (!user) {
    return <Spinner message="Загружаем профиль..." />
  }

  return (
    <div className="relative pb-2 h-full justify-center items-center">
      <div className="flex flex-col pb-5">
        <div className="relative flex flex-col mb-7">
          <div className="relative flex flex-col justify-center items-center">
            <img
              src={randomImage}
              className="w-full h-370 2xl:h-510 shadow-lg object-cover"
              alt="banner picture"
            />
            <img
              src={logo}
              className="absolute right-1/2 translate-x-1/2 bottom-1/2 w-300 px-5"
              alt="logo"
            />
            <img
              src={user.image}
              className="rounded-full w-20 h-20 -mt-10 shadow-xl object-cover"
              alt="profile image"
            />
            <h1 className="font-bold text-3xl text-center mt-3">
              {user.userName}
            </h1>
            <div className="absolute top-0 z-10 right-0 p-2">
              {userId === user._id && (
                <GoogleLogout
                  clientId={process.env.REACT_APP_GOOGLE_API_TOKEN}
                  render={(renderProps) => (
                    <button
                      type="button"
                      className="bg-white p-2 rounded-full cursor-pointer outline-none shadow-md"
                      onClick={renderProps.onClick}
                      disabled={renderProps.disabled}
                    >
                      <AiOutlineLogout color="red" fontSize={21} />
                    </button>
                  )}
                  onLogoutSuccess={logout}
                  cookiePolicy="single_host_origin"
                />
              )}
            </div>
          </div>
          <div className="text-center mb-7">
            <button
              type="button"
              onClick={(e) => {
                setText(e.target.textContent)
                setActiveBtn('created')
              }}
              className={`${activeBtn === 'created' ? activeBtnStyles : notActiveBtnStyles} mr-4`}
            >
              Созданные
            </button>
            <button
              type="button"
              onClick={(e) => {
                setText(e.target.textContent)
                setActiveBtn('saved')
              }}
              className={`${activeBtn === 'saved' ? activeBtnStyles : notActiveBtnStyles}`}
            >
              Сохраненные
            </button>
          </div>
          {pins?.length ? (
            <div className="px-2">
              <MasonryLayout pins={pins} />
            </div>
          ) : (
            <div className="flex justify-center font-bold items-center w-full text-xl mt-2">
              No Pins Found!
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserProfile