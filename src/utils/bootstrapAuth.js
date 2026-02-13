import { UserToken } from '../store/reducers/commonSlice';
export const bootstrapAuth = async (dispatch) => {
  try {
    console.log('CALLED TOKEN GENRATED');
    await dispatch(
      UserToken({ user_name: 'john' })
    ).unwrap();

  } catch (error) {
    console.error('bootstrapAuth failed:', error);
  }
};
