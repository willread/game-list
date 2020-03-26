curl --header "Content-Type: application/json" \
  --request PUT \
  --data '{"terms":"sonic adventure 2 dreamcast"}' \
  -b "" \
  http://localhost:3000/api/list

  curl --header "Content-Type: application/json" \
  --request GET \
  -b "" \
  http://localhost:5000/api/auth-test