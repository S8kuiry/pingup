import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI
    if (!uri) throw new Error("MONGODB_URI is not defined in environment variables")

    await mongoose.connect(uri, {
      dbName: 'pingup', // specify your DB name
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // 10s timeout
    })

    mongoose.connection.on('connected', () => {
      console.log('✅ MongoDB connected')
    })

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err)
    })
  } catch (err) {
    console.error('MongoDB connection failed:', err)
    process.exit(1) // exit to avoid app running without DB
  }
}

export default connectDB
