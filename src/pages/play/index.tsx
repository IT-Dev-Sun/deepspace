import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers'
import { sign, SignOpts } from 'web3-token'
import config from '../../config';
import Image from "next/image"
import styled from 'styled-components';
import PlayContentImage from '../../asset/image/play_content.png'
import SignFormImage from '../../asset/image/sign-card.png'
import pengGuinImg from '../../asset/image/penguin.svg'
import SignUpInput from '../../components/SignUpInput';
import SignUpOption from '../../components/SignUpOption'
import { Form } from 'reactstrap'
import { ToastContainer } from 'react-toastr';
import "toastr/build/toastr.css";
import "animate.css/animate.css";
import { FaApple, FaWindows } from 'react-icons/fa';
import Default from "../../layouts/Default";


const pageId = 'play'
const ERROR_MSG = [
  'Unknown error occured while processing signup',
  'Invalid wallet signing request',
  'Password does not meet security guidelines',
  'Your DPS balance does not meet the minimum requirements',
  'Your wallet has already been registered',
  'Your e-mail address has already been registered',
  'Please fill out the form completely.'
];
const PlayStyle = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    .bgParent {
      background: url(/images/dps_tank.png);
      background-repeat: no-repeat;
      background-size: 60%;
      background-position: right 35%;
    }
    .content {
      padding: 50px;
      margin-top: 40px;
    }
    .recovery {
        text-align: center;
    }
    .recovery a {
        text-decoration: underline;
        cursor: pointer;
    }
    .heading-font{
        font-size:32px;
    }
    .content-font{
        font-size: 20px;
    }
    button.content-font{
        font-size:21px;
    }
    .play-content{
        max-width:872px;
        font-size:26px;
    }
    .download-button > div{
        background-image:url(/images/download-button.png);
        background-position: center;
        background-size: 100% 100%;
        background-repeat: no-repeat;
    }
    .unavailable {
      color: #999;
    }
    .unavailable a {
      cursor: not-allowed;
    }
    .sign-form{
        font-size:28px;
        font-weight:bold;
        background-blend-mode: multiply;
    }
    
    .sign-button{
        background-image:url('/images/sign-button.png');
        background-position: center;
        background-size: 100% 100%;
        background-repeat: no-repeat;
        overflow:hidden;
        text-align:center;
        color:white;
    }
    .sign-button button{
        color:white!important;
        padding:21px 18px;
        font-weight:bold;
        width:95%;
        border-radius:48px!important;
        overflow:hidden;

    }
    .signup-form-container {
      padding: 0px 80px 0px 80px;
    }

    @media(max-width:1536px){
        .content-font{
            font-size:20px;
        }
        .sign-form{
            font-size:26px;
            font-weight:bold;
        }
        
        .play-content{
            max-width:800px;
        }
        button.content-font{
            font-size:16px;
        }
    }
    @media(max-width:1280px){
        .content-font{
            font-size:21px;
        }
        .sign-form{
            font-size:23px;
            font-weight:bold;
        }
        .play-content{
            max-width:628px;
        }
    }
    @media(max-width:640px){
        .content-font{
            font-size:20.44px;
        }
        .sign-form{
            font-size:21px;
        }
        .alpha-sign-heading{
            font-size:26px;
            padding-top:21px!important;
        }
       
    }
    @media(max-width:535px){

        .content-font{
            font-size:18px;
        }
        .sign-form{
            font-size:19px;
        }
        .signup-form-container {
          padding: 0px 30px 0px 30px;
        }
        
    }
    @media(max-width:320px){

        .content-font{
            font-size:13px;
        }
        .sign-form{
            font-size:14px;
        }
        .alpha-sign-heading{
            font-size:24px;
        }
        .signup-form-container {
          padding: 0px 30px 0px 30px;
        }
    }
    .playImage {
      img {
        object-fit: contain;
      }
    }
`

export default function Play() {
  const SIGNUP_URI = config.SIGNUP_URI;
  const PWRECOVERY_URI = config.PWRECOVERY_URI;
  let container;
  const [email, setEmail] = useState('')
  const [passwordOne, setPasswordOne] = useState('')
  const [passwordTwo, setPasswordTwo] = useState('')
  const [gender, setGender] = useState(null)
  const [error, setError] = useState(null)
  async function signWeb3tokenForSignup() {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()

      const opts = {
        statement: 'Welcome to DEEPSPACE! Click "Sign" to link the connected wallet to your DPS account',
        expire_in: '30m',
      } as SignOpts;

      const token = await sign(async (msg: any) => await signer.signMessage(msg), opts)
      return token
    } catch (ex) {
      setError('Unable to sign message. Please have metamask extension installed and connected.')
      return null
    }
  }
  async function signWeb3tokenForRecovery() {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()

      const opts = {
        statement: 'Click "Sign" to have a Password Recovery link sent to your email.',
        expire_in: '30m',
      } as SignOpts;

      const token = await sign(async (msg: any) => await signer.signMessage(msg), opts)
      return token
    } catch (ex) {
      setError('Unable to sign message. Please have metamask extension installed and connected.')
      return null
    }
  }
  useEffect(() => {
    if (error != null) {
      container.error(error, "Error")
      setError(null);
    }
  }, [error])
  const onRecoverPassword = async (event) => {
    event.preventDefault()
    setError(null)
    const signedWeb3Token = await signWeb3tokenForRecovery()
    if (!signedWeb3Token) return

    const res = await fetch(PWRECOVERY_URI, {
      body: JSON.stringify({
        web3token: signedWeb3Token,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })

    const result = await res.json()
    container.clear();
    if (result.success) {
      container.success("You Password Recovery email is on its way", "Success");
    }
    else {
      setError(result.errorMessage);
    }

  }

  const onSubmit = async (event) => {
    event.preventDefault()
    setError(null)
    if (event.target.Password.value === '') {
      setError("Please enter password !");
    } else if (passwordOne === passwordTwo) {
      const signedWeb3Token = await signWeb3tokenForSignup()

      if (!signedWeb3Token) return;
      container.info("Please wait for sign up confirmation", "Message");

      const res = await fetch(SIGNUP_URI, {
        body: JSON.stringify({
          email: event.target.Email.value,
          password: event.target.Password.value,
          gender: gender,
          web3token: signedWeb3Token,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      })

      const result = await res.json()
      container.clear();
      if (result.success) {
        container.success("Welcome to DEEPSPACE", "Signup Success");
      } else {
        setError(ERROR_MSG[result.errorCode])
      }
    } else {
      container.clear();
      setError('Passwords do not match')
    }
  }
  const onChange = (event, type) => {
    if (type === 'Email') {
      setEmail(event.target.value)
    } else if (type === 'Password') {
      setPasswordOne(event.target.value);
    } else if (type === 'Confirm Password') {
      setPasswordTwo(event.target.value);
    }
  }
  const onChangeGender = (value) => {
    setGender(value)
  }

  if (!config.PAGES.includes(pageId)) {
    return null
  }
  return (
    <>
      <ToastContainer ref={ref => container = ref} className="toast-top-right" />
      <PlayStyle className="w-full goldman-font">
        <div className='flex justify-center mx-2 sm:mx-0 lg:px-6 2xl:px-12'>
          <div className="relative z-10 hidden play-content px-9 lg:block">
            <div className="content bgParent">
              <div className="font-bold heading-font">PLAY DEEPSPACE!</div>
              <div className='flex w-full'>
                <div className="w-3/5">
                  <div className="mt-8 content-font">
                    <p> DEEPSPACE is a space based</p>
                    <p> Play-to-Earn metaverse </p>
                    <p> strategy exploration game</p>
                    <p> built on BNB Smart Chain!</p>
                  </div>
                  <div className="mt-8 content-font">
                    <p> Buy, trade and upgrade </p>
                    <p> spaceships. Explore our </p>
                    <p> expansive universe, mine</p>
                    <p> for resources, and battle</p>
                    <p> AI opponents and other</p>
                    <p> players!</p>
                  </div>
                </div>
                {/* <div className='flex items-center justify-center playImage'>
                  <div>
                    <Image src={TankImage} width={'240px'} height={'240px'} />
                  </div>
                </div> */}
              </div>

              <div className='flex justify-center mt-16 font-bold download-text text-align-center' style={{ marginBottom: 20 }}>
                DOWNLOAD
              </div>

              <div className="flex justify-center download-button">
                <div className="">
                  <button className="flex items-center px-6 py-2 text-white content-font"><a href="https://dps.space/play-win">
                    <span>Windows</span></a> &nbsp;&nbsp;<FaWindows /></button>
                </div>
                <div className="ml-6">
                  <button className="flex items-center px-6 py-2 unavailable content-font"><a download> <span>Mac OS (in progress)</span>&nbsp;&nbsp; </a> <FaApple style={{ marginBottom: 5 }} /></button>
                </div>
                <div className="ml-6">
                  <button className="flex items-center px-6 py-2 text-white content-font"><a href="https://dps.space/play-linux-standalone">Linux&nbsp;&nbsp;</a> <Image src={pengGuinImg} width={'20'} height={'20'} /></button>
                </div>
              </div>

            </div>

            <div className='absolute top-0 left-0 w-full h-full' style={{ 'zIndex': -1 }}>
              <Image src={PlayContentImage} layout="fill" />
            </div>

          </div>
          <div className="relative z-10 sign-form lg:ml-6 xl:ml-16">
            <div className='signup-form-container'>
              <div className='pt-4 text-center alpha-sign-heading lg:pt-12'>Create Account</div>
              <Form className="custom-form" onSubmit={onSubmit} autoComplete="off">
                <SignUpInput
                  onChange={onChange}
                  type={'Email'} />
                <SignUpInput onChange={onChange} type={'Password'} />
                <SignUpInput onChange={onChange} type={'Confirm Password'} />
                <SignUpOption title={'Character Gender'} onChange={onChangeGender} />
                <div className="mt-4 mb-10 sign-button">
                  <button type='submit'>Sign Up</button>
                </div>
              </Form>
              <div className="recovery content-font" style={{ position: 'relative', top: '-15px' }}>
                Trouble logging in?<br />
                <a onClick={onRecoverPassword}>Recover your password</a>.
              </div>
            </div>
            <div className='absolute top-0 left-0 w-full h-full' style={{ zIndex: -1 }}>
              <Image src={SignFormImage} layout="fill" alt="next/image" />
            </div>
          </div>
        </div>
      </PlayStyle>
    </>
  )
}
Play.Layout = Default;
