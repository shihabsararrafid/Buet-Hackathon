#!/bin/sh
# wait-for.sh

set -e

host=$(echo "$1" | cut -d ":" -f 1)
port=$(echo "$1" | cut -d ":" -f 2)
shift
cmd="$@"

until nc -z "$host" "$port"; do
  >&2 echo "Waiting for $host:$port..."
  sleep 1
done

>&2 echo "$host:$port is available"
exec $cmd