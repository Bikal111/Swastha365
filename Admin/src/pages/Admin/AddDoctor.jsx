import React from 'react'
import {assets} from '../../assets/assets'

const AddDoctor = () => {
  return (
    <form action="">
      <p>Add Doctor</p>

      <div>
        <div>
          <label htmlFor="doc-img">
            <img src={assets.upload_area} alt="" />
          </label>
          <input type="file" id="doc-img" hidden />
          <p>Upload Doctor <br />Picture</p>
        </div>

        <div>
          <div>
            <div>
              <p>Doctor Name</p>
              <input type="text" placeholder='Enter Name of Doctor' required />
            </div>
            <div>
              <p>Docotr Email</p>
              <input type="email" placeholder='Enter Doctor Email' required />
            </div>
            <div>
              <p>Doctor Password</p>
              <input type="password" placeholder='Enter Doctor Password' required />
            </div>
            <div>
              <p>Experience</p>
              <select name="" id="">
                <option value="1 Year">1 Year</option>
                <option value="2 Year">2 Year</option>
                <option value="3 Year">3 Year</option>
                <option value="4 Year">4 Year</option>
                <option value="5 Year">5 Year</option>
                <option value="6 Year">6 Year</option>
                <option value="7 Year">7 Year</option>
                <option value="8 Year">8 Year</option>
                <option value="9 Year">9 Year</option>
                <option value="10 Year">10 Year</option>
                <option value="11 Year">11 Year </option>
                <option value="12 Year">12 Year</option>
                <option value="13 Year">13 Year</option>
                <option value="14 Year">14 Year</option>
                <option value="15 Year">15 Year</option>
                <option value="16 Year">16 Year</option>
                <option value="17 Year">17 Year</option>
                <option value="18 Year">18 Year</option>
                <option value="19 Year">19 Year</option>
                <option value="20 Year">20 Year</option>
                <option value="21 Year">21 Year</option>
                <option value="22 Year">22 Year</option>
                <option value="23 Year">23 Year</option>
                <option value="24 Year">24 Year</option>
                <option value="25 Year">25 Year</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}

export default AddDoctor