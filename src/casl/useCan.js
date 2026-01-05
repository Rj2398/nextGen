import {useMemo} from 'react';
import {useSelector} from 'react-redux';
import {defineAbilities} from './defineAbilities';

export const useCan = (action, subject) => {
  const {userInfo} = useSelector(({user}) => user);
  console.log(userInfo?.casl, 'userInfo?.casl');

  // This is good, it limits recalculation to when userInfo changes
  const ability = useMemo(() => {
    return defineAbilities(userInfo?.casl || {});
  }, [userInfo?.casl]);

  return ability.can(action, subject);
};
