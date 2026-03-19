import { UserToken, UserOdooToken } from '../store/reducers/commonSlice';
export const bootstrapAuth = async (dispatch) => {
  try {
    console.log('CALLED TOKEN GENERATED');

    await dispatch(UserToken({ user_name: 'john' })).unwrap();
    await dispatch(UserOdooToken({ user_name: "ravina" })).unwrap();

  } catch (error) {
    console.error('bootstrapAuth failed:', error);
  }
};
