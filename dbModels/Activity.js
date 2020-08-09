import mongoose, {Schema} from 'mongoose'

const ActivitySchema = new Schema({
  click_x: {
    type: Number,
    required: true,
  },
  click_y: {
    type: Number,
    required: true,
  },
  screen_width: {
    type: Number,
    required: true,
  },
  orientation: {
    type: String,
    required: true,
  },
  scroll_x: {
    type: Number,
    required: true,
  },
  scroll_y: {
    type: Number,
    required: true,
  },
  page_uri: {
    type: String,
    required: true,
  },
  timestamp: {
    type: String,
    required: true,
  },
  nearest_elems_data: {
    type: Array,
    required: true,
  },
  target_elem_data: {
    type: Array,
    required: true,
  },
})

const Activity = mongoose.model('Activity', ActivitySchema)

export default Activity
