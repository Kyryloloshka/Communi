import { DocumentData } from 'firebase/firestore'
import UserCard from './UserCard'
import {ChatType} from './UserCard'
const Users = ({user}: {user: DocumentData | null | undefined}) => {

  return (
    <>
      <UserCard 
        name="Tohasd fasasd as fdas fasdfasd af das fdasdfas das" 
        avatarUrl="https://i.pravatar.cc/300"
        latestMessageText="Hello"
        time="10:00"
        type={ChatType.Chat}
      />
      <UserCard 
        name="Baasdfasdfa sdaf asdf sad fasdsd s dfsdf sf asdf ka" 
        avatarUrl="https://i.pravatar.cc/300"
        latestMessageText="Helasdf sdf sda asdfdf sasdasd asfd falo"
        time="10:00"
        type={ChatType.Chat}
      />
      <UserCard 
        name="Ziksdaffsdadfaaasdfas sad sdfs df" 
        avatarUrl="https://i.pravatar.cc/300"
        latestMessageText="Heljdfsdjsdafkllksdafjklasdfljksjkldaflkjsadflkjfdsalkj asd fsad fas lo"
        time="10:00"
        type={ChatType.Chat}
      />
    </>
  )
}

export default Users