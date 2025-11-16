import doctorModel from "../models/docotorModel.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import appointmentModel from "../models/appointmentModel.js"


const changeAvailablity = async (req, res) => {
  try {
    const { docId } = req.body

    const docData = await doctorModel.findById(docId)
    await doctorModel.findByIdAndUpdate(docId, { available: !docData.available })
    res.json({ success: true, message: 'Availability Changed' })

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message })
  }
}

const doctorList = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select(['-password', '-email'])

    res.json({ success: true, doctors })
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message })
  }
}

// API for doctor login 

const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body
    const doctor = await doctorModel.findOne({ email })

    if (!doctor) {
      return res.json({ success: false, message: 'Invalid credenials' })
    }

    const isMatch = await bcrypt.compare(password, doctor.password)
    if (isMatch) {
      const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET)

      res.json({ success: true, token })
    } else {
      res.json({ success: false, message: 'Invalid credenials' })
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message })
  }
}

// API to get doctor appointment for doctor pannel 

const appointmentsDoctor = async (req, res) => {
  try {
    const { docId } = req.doctor
    const appointments = await appointmentModel.find({ docId })

    res.json({ success: true, appointments })

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message })
  }
}


//API to mark appointment complete
const appointmentComplete = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const docId = req.doctor.docId;

    if (!appointmentId || !docId) {
      return res.json({ success: false, message: "Missing data" });
    }

    const appointmentData = await appointmentModel.findById(appointmentId);

    if (!appointmentData) {
      return res.json({ success: false, message: "Appointment not found" });
    }

    // ✅ Safely compare only if docId exists in appointment
    if (appointmentData.docId && appointmentData.docId.toString() === docId.toString()) {
      await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true });
      return res.json({ success: true, message: "Appointment completed" });
    } else {
      return res.json({ success: false, message: "Mark failed: doctor mismatch" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//API to mark appointment canceled
const appointmentCancel = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const docId = req.doctor.docId;

    if (!appointmentId || !docId) {
      return res.json({ success: false, message: "Missing data" });
    }

    const appointmentData = await appointmentModel.findById(appointmentId);

    if (!appointmentData) {
      return res.json({ success: false, message: "Appointment not found" });
    }

    // ✅ Safe check to avoid undefined.toString()
    if (appointmentData.docId && appointmentData.docId.toString() === docId.toString()) {
      await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });
      return res.json({ success: true, message: "Appointment cancelled" });
    } else {
      return res.json({ success: false, message: "Cancellation failed: doctor mismatch" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//API to get dashboarddata

const doctorDashboard = async (req, res) => {
  try {

    const { docId } = req.doctor;
    const appointments = await appointmentModel.find({ docId })

    let earnings = 0

    appointments.map((item) => {
      if (item.isCompleted || item.payment) {
        earnings += item.amount
      }
    })

    let patients = [];

    appointments.forEach((item) => {
      if (!patients.includes(item.userId)) {
        patients.push(item.userId);
      }
    });

    const dashData = {
      earnings,
      appointments: appointments.length,
      patients: patients.length,
      latestAppointments: appointments.reverse().slice(0, 5)

    }

    res.json({ success: true, dashData })

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}

//API to get doctor profile

const doctorProfile = async (req, res) => {
  try {
    const { docId } = req.doctor
    const profileData = await doctorModel.findById(docId).select('-password')

    res.json({ success: true, profileData })


  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}


//API to update doctor profile data fr4om doctor panel

const updateDoctorProfile = async (req, res) => {
  try {
    // get docId from auth middleware (recommended)
    const docId = req?.doctor?.docId || req?.doctor?.id || req.body?.docId

    if (!docId) {
      return res.json({ success: false, message: 'No doctor id found in request (auth failure?)' })
    }

    const { image, name, degree, speciality, fees, address, available } = req.body

    await doctorModel.findByIdAndUpdate(docId, {
      image,
      name,
      degree,
      speciality,
      fees,
      address,
      available
    }, { new: true })

    res.json({ success: true, message: 'Profile Updated' })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}


export {
  changeAvailablity,
  doctorList,
  loginDoctor,
  appointmentsDoctor,
  appointmentCancel,
  appointmentComplete,
  doctorDashboard,
  updateDoctorProfile,
  doctorProfile
}