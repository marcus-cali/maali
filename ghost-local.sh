#!/bin/bash

# Ghost Local Development Manager
# Commands: start, stop, restart, logs, export

case "$1" in
  start)
    echo "🚀 Starting local Ghost server..."
    docker-compose up -d
    echo "⏳ Waiting for Ghost to initialize..."
    sleep 10
    echo "✅ Ghost is running at: http://localhost:2368"
    echo "👻 Ghost Admin: http://localhost:2368/ghost"
    echo ""
    echo "📝 First time setup:"
    echo "1. Go to http://localhost:2368/ghost"
    echo "2. Create your admin account"
    echo "3. Go to Settings → Theme"
    echo "4. You'll see 'maali' theme available - activate it!"
    ;;
    
  stop)
    echo "🛑 Stopping Ghost server..."
    docker-compose down
    echo "✅ Ghost server stopped"
    ;;
    
  restart)
    echo "🔄 Restarting Ghost server..."
    docker-compose restart
    echo "✅ Ghost server restarted"
    ;;
    
  logs)
    echo "📋 Ghost server logs (Ctrl+C to exit):"
    docker-compose logs -f ghost
    ;;
    
  export)
    echo "📦 Exporting theme for manual upload..."
    ./export-theme.sh
    ;;
    
  status)
    echo "📊 Ghost server status:"
    docker-compose ps
    ;;
    
  *)
    echo "Ghost Local Development Manager"
    echo "Usage: ./ghost-local.sh {start|stop|restart|logs|export|status}"
    echo ""
    echo "Commands:"
    echo "  start   - Start local Ghost server"
    echo "  stop    - Stop local Ghost server"
    echo "  restart - Restart Ghost server"
    echo "  logs    - View Ghost logs"
    echo "  export  - Export theme to output folder"
    echo "  status  - Check server status"
    ;;
esac