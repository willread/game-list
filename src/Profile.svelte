<script>
  import { user } from './auth';
</script>


<h3>Hi { $user.displayName }!</h3>

<img src={ $user.photoURL } width="100" alt="user avatar">
<p>Your userID is { $user.uid }</p>
