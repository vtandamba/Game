window.onload = function() { // à l'ouverture de la fenêtre du navigateur

    //Déclaration des variables globales (def du jeu)
    // ----------------------------------------------------------------------------------------------
    var canvasWidth = 900; // largeur du plateau
    var canvasHeight = 600; // hauteur du plateau
    var blockSize = 30; // taille des blocs
    var ctx; // le context du canvas
    var widthInBlocks = canvasWidth/blockSize; // Largeur des blocs
    var heightInBlocks = canvasHeight/blockSize; // hauteur des blocs
    var bouboule; // un serpent
    var delay = 100; // taux de rafraichissement
    var centreX= canvasWidth / 2; // centre X du plateau
    var centreY= canvasHeight / 2; // centre Y du plateau
    var timeOut; // temps de rafraichissement

    // Déclaration des Méthodes
    // -----------------------------------------------------------------------------------------------

    function init(){ // initialisation du jeu
        var canvas = document.createElement('canvas'); // création du Canvas
        canvas.width = canvasWidth; // on affecte les valeurs de taille au canvas
        canvas.height = canvasHeight;
        canvas.style.border = "30px solid gray"; // une bordure de 30px trait continu gris autour
        canvas.style.margin = "50px auto"; //marge en haut de 50px et centré 
        canvas.style.backgroundColor = "#ddd"; // un fond gris
        canvas.style.display = "block";
        document.body.appendChild(canvas); // mise en place dans le body
        ctx = canvas.getContext('2d'); // Le contexte du canvas est 2D
        bouboule = new Snake([[6,4],[5,4],[4,4],[3,4]],"right"); // création du serpent
        pomme = new Apple([10,10]); // création d'une pomme
        refreshCanvas(); // actualisation du canvas
    }

    // -----------------------------------------------------------------------------------------------
    // Fonction Game OVER
    // Entrée  rien
    // sortie Restart
    // -----------------------------------------------------------------------------------------------
    
    function gameOver() { // affichage GAMEOVER fin du jeu
        ctx.save(); // sauvegardedu context
        ctx.font = "bold 70px sans-serif"; // gras, 70px , sans serif pour GAMEOVER
        ctx.fillStyle = "#000"; // noir
        ctx.textAlign = "center"; // centrer
        ctx.textBaseLine="middle";
        //ctx.strokeStyle="white";
        ctx.lineWidth=5;
        //ctx.strokeText("GAME OVER",centreX, centreY-180);
        ctx.fillText("GAME OVER", centreX, centreY -180); // Afficher le texte
        ctx.font="bold 30px sans-serif"; // gras, 30px, sans serif : Appuyer sur espace...
        ctx.fillText("Appuyer sur la barre Espace pour rejouer", centreX, centreY-120);
        ctx.restore(); // restore le contexte
        bouboule.setDirection(newDirection); // nouvelle direction pour serpent
    }

    // -----------------------------------------------------------------------------------------------

    function restart() {
        // création d'un serpent
        bouboule = new Snake([[6,4],[5,4],[4,4],[3,4],"right"]);
        // création de la pomme
        pomme = new Apple([10,10]);
        clearTimeout(timeOut);
        refreshCanvas();
    }

    // -----------------------------------------------------------------------------------------------

    function refreshCanvas() { // fonction d'actualisation du canvas  
        bouboule.move(); // bouge le serpent
        if (bouboule.checkCollision()) { // test de collision
            gameOver(); // fin de partie
        } else {
            if (bouboule.isEatingApple(pomme)) {
                bouboule.ateApple = true;
                do {
                    pomme.setNewPosition(); // re génération d'une nouvelle pomme
                } while(pomme.isOnSnake(bouboule)); 
            }
        }
        ctx.clearRect(0,0,canvasWidth, canvasHeight);// efface tout
        bouboule.draw(); // dessine le serpent
        pomme.draw(); // Création de la pomme
        timeOut = setTimeout(refreshCanvas,delay);  // tous les delay
    }

    // -----------------------------------------------------------------------------------------------

    function drawBlock(ctx,position) { //dessin des blocs 
        //constituant le serpent 
        //(en fonction de position (tab de corps)) 
        var x = position[0]*blockSize; // valeur de la coordonnée abcisse en pixels
        var y = position[1]*blockSize; // valeur de la coordonnée ordonnée en pixels
        ctx.fillRect(x,y,blockSize,blockSize);  // un élément du corps du serpent
    }

    // ---------------------------------------------------------------------------------------------
    // Ecoute du clavier
    // ---------------------------------------------------------------------------------------------

    document.onkeydown = function handleKeyDown(e){ // gestion du clavier
        var key = e.keyCode; // code touche du clavier
        var newDirection;  // on effecte les direction en fonction de la touche enfonçée
        switch(key) {
            case 37:
                newDirection = "left"; // flèche vers la gauche
                break;
            case 38:
                newDirection = "up"; // flèche vers le haut
                break;
            case 39:
                newDirection = "right"; // flèche vers la droite
                break;
            case 40:
                newDirection = "down"; // flèche vers le bas
                break;
            case 32: // la barre d'espace
                restart();
                return;
                break;
            default:
                return;
        }
        bouboule.setDirection(newDirection);// vérification de l'autorisation par la fonction setDirection
    };

    // -----------------------------------------------------------------------------------------------------
    // Nos objets (Snake et Pomme)
    // -----------------------------------------------------------------------------------------------------

    // Constructeur de notre Snake

    function Snake(body, direction) { // Contruction du Serpent
        // body (corps du serpent est un tableau)
        this.body = body; // tableau corps du serpent
        this.direction = direction; // direction du déplacement

        // --------------------------
        // Méthodes du Snake
        // --------------------------

        this.draw = function() { // dessin le serpent
            ctx.save(); // sauvegarde du context
            ctx.fillStyle="#00ff00"; // serpent vert
            for (var i=0; i<this.body.length; i++) {
                drawBlock(ctx,this.body[i]);// parcours le tableau 
                //pour dessiner le corps serpent 
            }
            ctx.restore(); // restoration du context
        }

         // ----------------------------

        this.move = function() { // déplacement du serpent
            var nextPosition = this.body[0].slice(); // ajout d'une nouvelle tête
            switch (this.direction) { // en fonction de la direction
                case "left":
                    nextPosition[0] -=1 ; // Vers la gauche, nous retirons 1 sur l'axe des abcisses [0], les ordonnées restent inchangés
                    break;
                case "right": // Vers la droite, nous ajoutons 1 sur l'axe des abcisses [0], les ordonnées restent inchangés
                    nextPosition[0] +=1 ; //nextPosition[0] = nextPosition[0] + 1
                    break;
                case "down":
                    nextPosition[1] +=1 ; // vers le bat les abcisses restent inchangées et l'axe des ordonnées gagne 1 [1]
                    break;
                case "up":
                    nextPosition[1] -=1 ;  // vers le haut les abcisses restent inchangées et l'axe des ordonnées perd 1 [1]
                    break;
                default:
                    throw("invalid direction");

            }
            
            this.body.unshift(nextPosition); // mise en place de la tête
            if (!this.ateApple) 
                this.body.pop(); // suppression de la queue si mange pas
            else 
                this.ateApple = false; // a mangé et ne mange plus
                // on ne supprime pas la queue -> il grandit
        }

         // ---------------------------

        this.setDirection = function(newDirection) { // test de direction
            var allowedDirections; // directions autorisées
            switch(this.direction) {
                case"left":
                case "right": // si la direction est vers la gauche ou droite, nous autorisons haut et bas
                    allowedDirections=["up","down"];
                    break;
                case "up":
                case "down": // si la direction est bas ou haut, nous autorisons gauche et droite
                    allowedDirections=["left","right"];
                    break;
                default:
                    throw("invalid direction");
            }
            if (allowedDirections.indexOf(newDirection) >-1) { // Si la position dans la chaine de caractère "allowedDirection" est >= -1 alors il y a une direction de prise
                this.direction=newDirection; // affectation de la nouvelle direction
            }
        }

        // -------------------------------

          this.checkCollision = function(){ // test de collision
            var wallCollision = false; // sur les mur du plateau
            var snakeCollision = false; // sur lui-meme
            var head = this.body[0]; // coordonnées de la tête
            var rest = this.body.slice(1); // coordonnées du rest du corps
            var snakeX = head[0]; // reccupération des coordonnées X de la tête
            var snakeY = head[1]; // reccupération des coordonnées Y de la tête
            var minX = 0;
            var minY = 0;
            var maxX = widthInBlocks - 1;
            var maxY = heightInBlocks - 1;
            // test si dans le mur
            var isNotBetweenHorizontalWalls = snakeX < minX || snakeX > maxX;
            var isNotBetweenVerticalWalls = snakeY < minY || snakeY > maxY;

            if (isNotBetweenHorizontalWalls || isNotBetweenVerticalWalls)
                wallCollision = true;
            // test si il se mange
            for (var i=0 ; i<rest.length ; i++){  // On parcours le tableau rest
                if (snakeX === rest[i][0] && snakeY === rest[i][1])
                    snakeCollision = true;
            }

            return wallCollision || snakeCollision; // retourne True si collision
        };

         // --------------------------------

        // test si mange une pomme
        this.isEatingApple = function(appleToEat){
            var head = this.body[0];// coordonnées de la tête
            if (head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1])
                return true; // si correspond aux coordonnées de la pomme
            else
                return false; // à coté de la pomme
        }

    }
// -------------- FIN Snake -------------------------------------------------------
   
    // Constructeur de la pomme
    

    function Apple(position) { // La pomme
        this.position = position; // on donne la postion passé en argument à la pomme
        
        // --------------------------
        // Méthodes de la pomme
        // --------------------------

        this.draw = function() { // Dessin de la pomme
            ctx.save(); // sauvegarde du context
            ctx.fillStyle = "red"; // pomme rouge
            ctx.beginPath(); // on commence le chemin
            var radius = blockSize/2; // rayon
            var x = this.position[0]*blockSize + radius; // coordonnée X
            var y = this.position[1]*blockSize + radius; // coordonnée Y

            ctx.arc(x, y, radius, 0, Math.PI*2, true); // dessin
            ctx.fill(); // rempli
            ctx.restore();// restauration du context
        }

         // ------------------------------

        this.setNewPosition = function() { // nouvelle position de la pomme
            var newX = Math.round(Math.random()*(widthInBlocks-1)+1); // aléatoire X
            var newY = Math.round(Math.random()*(heightInBlocks-1)+1); // aléatoire Y
            this.position = [newX,newY]; // mise en place
        }

        // ------------------------------

        this.isOnSnake = function(snakeToCheck){ // vérification si pomme sur serpent
            var isOnSnake = false; // initialisation de la variable isOnSnake à faux
            for (var i=0 ; i < snakeToCheck.body.length ; i++) { // parcours le tableau du corps du serpent
                if (this.position[0]=== snakeToCheck.body[i][0] && this.position[1]===snakeToCheck.body[i][1]) {
                isOnSnake = true; // si position X de la pomme = la position X d'un élément du corps et si position y de la pomme  = la position y d'un élément du corp du serpent
                }
            }
        }
    }

    // ------------------------ fin Pomme --------------------------------------------------------------------

// Fin des méthodes --------------------------------------------------------------------------------------------------------------------------------

    // -------------------------------------------------------------------------------------------------------------------------------------------------------------
    // Lancement du jeu
    // --------------------------------------------------------------------------------------------------------------------------------------------------------------

    init(); // initialisation du jeu
}
