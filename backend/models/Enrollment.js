const enrollmentSchema = new mongoose.Schema({

  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: String, required: true },
  enrollmentDate: { type: Date, default: Date.now },
  paymentStatus: { type: String, default: 'Pending' },
  paymentAmount: { type: Number, required: true },
  paymentDate: { type: Date }
});

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);
