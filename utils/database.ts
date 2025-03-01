import 'react-native-reanimated';
import * as SQLite from 'expo-sqlite';
import { SQLiteProvider, useSQLiteContext, type SQLiteDatabase } from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';

export const DATABASE_NAME = "mydb.db";

export const loadDatabase = async () => {
  const dbPath = `${FileSystem.documentDirectory}SQLite/${DATABASE_NAME}`;

  // Controlla se il database esiste già
  const dbExists = await FileSystem.getInfoAsync(dbPath);

  if (dbExists.exists) {
    // Copia il file .db dalla cartella assets alla sandbox dell'app
    console.log('Copia del database preesistente...');
    const asset = Asset.fromModule(require('../assets/mydb.db'));
    await asset.downloadAsync();

    await FileSystem.makeDirectoryAsync(`${FileSystem.documentDirectory}SQLite`, {
      intermediates: true,
    });

    await FileSystem.copyAsync({
      from: asset.localUri!,
      to: dbPath,
    });
    console.log('Database copiato con successo!');
  } else {
    console.log('Database già esistente.');
  }

  // Apri il database
  const db = SQLite.openDatabaseSync(DATABASE_NAME);
  console.log('Database aperto:', DATABASE_NAME);

  return db;
};

export async function migrateDbIfNeeded(db: SQLiteDatabase) {
    const DATABASE_VERSION = 2;
    let result = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
    //let currentDbVersion = result ? result.user_version : 0;
    let currentDbVersion = 0;
    console.log('Current database version:', currentDbVersion);
    if (currentDbVersion >= DATABASE_VERSION) {
      console.log('Database is up to date, version:', currentDbVersion);
      return;
    }
  
    if (currentDbVersion === 0) {
      console.log('Migrating to version 1');

      // Verifica transazioni attive
      let hasActiveTransaction = await db.getAllAsync(`SELECT * FROM sqlite_master WHERE type='transaction';`);

      if (hasActiveTransaction.length > 0) {
        console.log('Transactions detected, waiting for commit...');
        await db.execAsync('COMMIT;'); // Chiudi eventuali transazioni in corso
      }

      await db.execAsync(`PRAGMA journal_mode = 'wal';`);
  
      await db.execAsync(`
        PRAGMA journal_mode = 'wal';
        DROP TABLE IF EXISTS "users";
        DROP TABLE IF EXISTS "events";
        DROP TABLE IF EXISTS "users_ll_for";
        DROP TABLE IF EXISTS "users_events";
        DROP TABLE IF EXISTS "icebreakers";
        DROP TABLE IF EXISTS "todos";
        DROP TABLE IF EXISTS "heads_up";
        DROP TABLE IF EXISTS "truth_or_dare";
        CREATE TABLE "users" (
          "username"	TEXT NOT NULL,
          "password"	TEXT NOT NULL,
          "name"	TEXT NOT NULL,
          "surname"	TEXT NOT NULL,
          "birthdate"	TEXT NOT NULL,
          "taralli"	INTEGER NOT NULL,
          PRIMARY KEY("username")
        );
        CREATE TABLE "events" (
          "name"	TEXT NOT NULL,
          "location"	TEXT NOT NULL,
          "latitude"	TEXT NOT NULL,
          "longitude"	TEXT NOT NULL,
          "date"	TEXT NOT NULL,
          "hour"	TEXT NOT NULL,
          "max_people"	INTEGER NOT NULL,
          "creator"	TEXT NOT NULL,
          "place"	TEXT NOT NULL,
          "local_legend_here"	TEXT NOT NULL,
          "secret_code"	INTEGER NOT NULL,
          "type"	TEXT NOT NULL,
          "city"	TEXT NOT NULL,
          "ended"	TEXT,
          "description" TEXT NOT NULL,
          PRIMARY KEY("name"),
          FOREIGN KEY("creator") REFERENCES "users"("username") ON DELETE CASCADE
        );
        CREATE TABLE "users_ll_for" (
          "username"	TEXT NOT NULL,
          "city"	TEXT NOT NULL,
          PRIMARY KEY("username","city"),
          FOREIGN KEY("username") REFERENCES "users"("username") ON DELETE CASCADE
        );
        CREATE TABLE "users_events" (
          "user"	TEXT NOT NULL,
          "event"	TEXT NOT NULL,
          PRIMARY KEY("user","event"),
          FOREIGN KEY("event") REFERENCES "events"("name") ON DELETE CASCADE,
          FOREIGN KEY("user") REFERENCES "users"("username") ON DELETE CASCADE
        );
        CREATE TABLE "icebreakers" (
          "name" TEXT NOT NULL,
          "description" TEXT NOT NULL,
          "rules" TEXT NOT NULL,
          PRIMARY KEY("name")
        );
        CREATE TABLE "heads_up" (
          "word" TEXT NOT NULL,
          PRIMARY KEY("word")
        );
        CREATE TABLE "truth_or_dare" (
          "question" TEXT NOT NULL,
          PRIMARY KEY("question")
        );

      `);
  
      await db.runAsync(`INSERT INTO "users" ("username","password","name","surname","birthdate","taralli")
        VALUES ('Peppe','password','Giuseppe','Arbore','2001-10-11',10),
                ('Caca','password','Claudia','Maggiulli','2002-03-26',0),
                ('Pio','password','Michelepio','Mucci','1999-12-26',3),
                ('Fra', 'password', 'Francesca', 'Porcelli', '2001-02-07', 5);
      `);
      await db.runAsync(`INSERT INTO "events" ("name","location","latitude","longitude","date","hour","max_people","creator","place","local_legend_here","secret_code","type","city","ended", "description") 
        VALUES ('Boat trip','Murazzi','45.05985','7.692342','2025-03-02','16:00',10,'Peppe','Outside','true',13,'Adventure','Turin','2025-03-02T20:00Z',   "Join us for an unforgettable boat trip along the scenic River Po in Turin! Set sail from the Murazzi area, and immerse yourself in the tranquil beauty of the river, surrounded by historic views of the city. This outdoor adventure promises a relaxing yet exciting experience with breathtaking views. Whether you're seeking a peaceful escape or a unique way to explore Turin, this boat trip is perfect for those looking to enjoy nature, great company, and the charm of the city from the water. Don’t miss out on this Adventure. Be sure to come prepared for an exciting time out on the water!"),
            ('Karaoke','Il Cantinone','45.064005','7.694438','2025-03-10','20:00',8,'Peppe','Inside','true',45,'Social','Turin','2025-03-11T03:40Z',  "Get ready to sing your heart out at Il Cantinone in Turin on March 10th, 2025, starting at 20:00! Hosted by Peppe, this Social event promises an evening full of fun, laughter, and great music. Whether you're a seasoned singer or just love to have fun with friends, our karaoke night will give you the perfect stage to shine. Enjoy a cozy indoor atmosphere while belting out your favorite tunes. The night will go on, so come prepared to party and make unforgettable memories! This is the ultimate event for music lovers and social butterflies—bring your friends, and let's make this karaoke night one to remember!"), 
            ('Polito Party','Politecnico','45.06236','7.66257','2025-01-01','20:00',8,'Pio','Inside','false',45,'Social','Turin','2026-12-31T08:43Z',  "Join us for an exciting event at Politecnico di Torino, where innovation, creativity, and energy meet! Whether it’s a social gathering, academic seminar, or fun celebration, this event promises to bring together students, faculty, and guests in an inspiring environment. With its vibrant atmosphere, you'll have the chance to connect, learn, and enjoy a unique experience in one of the most prestigious universities in Turin. Don’t miss out on being part of something special at Politecnico di Torino—where new ideas come to life!"),
            ('Tech Talk','Politecnico di Torino','45.06236','7.66257','2025-03-15','18:00',50,'Fra','Inside','true',100,'Curtural','Turin','2025-03-15T22:00Z', "Join us for an inspiring Tech Talk at Politecnico di Torino on March 15th, 2025. This event, hosted by Fra, will feature experts discussing the latest trends in technology, innovation, and research. Whether you're a student, professional, or simply passionate about tech, this is the perfect opportunity to learn and connect with others in the field. Don’t miss this exciting evening full of knowledge sharing and insightful discussions!"),
            ('Jazz Night','Caffè della Vetrina','45.068524','7.680123','2025-03-20','21:00',60,'Fra','Inside','false',60,'Social','Turin','2025-03-21T02:00Z', "Experience an unforgettable Jazz Night at Caffè della Vetrina in Turin on March 20th, 2025, starting at 21:00! Hosted by Fra, this musical event will feature live jazz performances from talented artists. If you’re a fan of smooth tunes and great vibes, this event is for you! Come enjoy the intimate indoor setting, where good music and even better company await."),
            ('Art Exhibition',"Galleria d’Arte",'45.070528','7.687298','2025-04-01','10:00',30,'Caca','Inside','true',50,'Curtural','Turin','2025-04-01T18:00Z', "Explore the creativity and talent of local artists at the Art Exhibition in Galleria d’Arte Torino on April 1st, 2025, starting at 10:00! Curated by Giulia, this exhibition will showcase a wide variety of contemporary art pieces. Whether you're an art enthusiast or just looking for a cultural experience, this is the perfect event to appreciate the beauty and diversity of art."),
            ('Outdoor Yoga','Parco Valentino','45.0589196','7.6912693','2025-04-05','08:00',25,'Fra','Outside','false',30,'Sport','Turin','2025-04-05T10:00Z', "Start your day with peace and mindfulness at our Outdoor Yoga session in Parco Valentino, Turin, on April 5th, 2025, beginning at 08:00. Led by Luca, this event offers a serene outdoor environment to refresh your mind and body through calming yoga exercises. Whether you're a beginner or an experienced yogi, all levels are welcome! Don’t forget to bring your yoga mat and enjoy a relaxing morning in nature."),
            ('Film Screening','Cinema Massimo','45.070612','7.676528','2025-04-10','19:30',80,'Pio','Inside','true',150,'Social','Turin','2025-04-10T22:30Z', "Join us for an exclusive Film Screening at Cinema Massimo in Turin on April 10th, 2025, starting at 19:30. Hosted by Pio, this event will feature a special screening of a critically acclaimed film. Come enjoy a night of cinema with fellow movie lovers in the comfortable and historic setting of Cinema Massimo. Don’t miss this opportunity to experience great film art and enjoy post-screening discussions!"),
            ('Charity Run','Piazza Castello','45.070802','7.686554','2025-04-12','09:00',700,'Peppe','Outside','true',250,'Sport','Turin','2025-04-12T12:00Z', "Join us for the Charity Run in Piazza Castello on April 12th, 2025, starting at 09:00. Hosted by Peppe, this event is all about giving back to the community while staying active. Run for a cause and support local charities, all while enjoying the beautiful scenery of Turin. Whether you're a competitive runner or just want to walk for charity, everyone is welcome to participate in this fun and meaningful event."),
            ('Craft Workshop','Officina Creativa','45.064881','7.692978','2025-04-20','14:00',15,'Fra','Inside','false',25,'Social','Turin','2025-04-20T17:00Z', "Unleash your creativity at the Craft Workshop in Officina Creativa on April 20th, 2025, starting at 14:00. Hosted by Fra, this hands-on workshop will guide you through creating beautiful handmade crafts. Whether you're looking to learn new skills or just enjoy a fun afternoon, this event is perfect for those who love to make and create. All materials will be provided, so just bring your enthusiasm!"),
            ('Beach Party','Lido San Francesco','41.12992','16.85539','2025-05-01','18:00',50,'Pio','Outside','true',100,'Social','Bari','2025-05-01T23:00Z', "Join us for a fun Beach Party at Lido San Francesco in Bari on May 1st, 2025! Starting at 18:00, enjoy the sunset, beach vibes, music, and great company as we dance the night away by the sea. Perfect for those who want to celebrate the beginning of the summer with a blast!"),
            ('Bari Food Festival','Fiera del Levante','41.12668','16.86304','2025-05-05','12:00',50,'Fra','Inside','true',200,'Cultural','Bari','2025-05-05T20:00Z', "Savor the best of Bari's culinary delights at the Bari Food Festival, taking place on May 5th, 2025. Explore local dishes, meet renowned chefs, and indulge in gourmet food from the region. Whether you're a food lover or a local looking to discover new flavors, this festival is a must-visit!"),
            ('Rock Concert','Teatro Petruzzelli','41.12536','16.86825','2025-05-10','20:00',20,'Peppe','Inside','true',300,'Cultural','Bari','2025-05-10T23:00Z', "Get ready for an unforgettable night of rock music at Teatro Petruzzelli in Bari! On May 10th, 2025, experience live performances from some of the best rock bands in Italy. Whether you're a die-hard fan or new to the scene, this concert promises an electrifying atmosphere!"),
            ('Art Show','Galleria Nazionale','41.12571','16.87150','2025-05-15','10:00',50,'Caca','Inside','true',100,'Cultural','Bari','2025-05-15T18:00Z', "Step into the world of art at the Art Show in Galleria Nazionale, Bari, on May 15th, 2025. Featuring works from local and international artists, this exhibition celebrates creativity and visual expression. Whether you're an art enthusiast or just curious, this event is the perfect place to immerse yourself in beauty."),
            ('Bari Marathon','Piazza del Ferrarese','41.12565','16.86540','2025-05-17','08:00',50,'Pio','Outside','false',10000,'Sport','Bari','2025-05-17T12:00Z', "Run for a cause at the Bari Marathon on May 17th, 2025! Starting at Piazza del Ferrarese, this event offers participants of all levels the opportunity to challenge themselves while enjoying the city's scenic views. Join us for a memorable race and help support local charities!"),
            ('Theater Play','Teatro Abeliano','41.10894','16.85891','2025-05-20','19:30',90,'Fra','Inside','false',120,'Cultural','Bari','2025-05-20T22:00Z', "Don't miss the latest theater play at Teatro Abeliano in Bari! On May 20th, 2025, immerse yourself in a captivating story brought to life by talented actors. This event promises to be a night full of drama, emotion, and artistic expression!"),
            ('Wine Tasting','Cantina Diomede','41.06421','16.70993','2025-05-25','17:00',30,'Fra','Inside','false',50,'Social','Bari','2025-05-25T20:00Z', "Experience the best wines of the region at the Wine Tasting event in Cantina Diomede on May 25th, 2025. Enjoy a guided tour of the winery and indulge in tasting some of the finest wines that Puglia has to offer. Perfect for connoisseurs and casual wine lovers alike!"),
            ('Bari Jazz Festival','Piazza del Ferrarese','41.12563','16.86649','2025-06-01','19:00',20,'Fra','Outside','false',300,'Social','Bari','2025-06-01T23:00Z', "Get ready for a night of smooth melodies at the Bari Jazz Festival on June 1st, 2025, in Piazza del Ferrarese. Enjoy live performances from local jazz musicians, relax, and let the music set the tone for an unforgettable evening under the stars."),
            ('Meditation Day','Monastero Santa Scolastica','41.12681','16.87365','2025-06-05','08:00',20,'Caca','Inside','true',30,'Health','Bari','2025-06-06T10:00Z', "Join us for a peaceful and rejuvenating Meditation Retreat at Monastero Santa Scolastica in Bari. From June 5th to June 6th, immerse yourself in a serene environment, practice mindfulness, and rejuvenate your mind and soul. This retreat is perfect for anyone looking to unwind and find inner peace."),
            ('Photo Workshop','Cittadella della Scienza','41.12256','16.87512','2025-06-10','09:00',25,'Pio','Inside','false',30,'Cultural','Bari','2025-06-10T13:00Z', "Unleash your creativity and capture stunning moments at the Photography Workshop in Cittadella Mediterranea della Scienza on June 10th, 2025. Whether you're a beginner or an experienced photographer, this hands-on workshop will guide you through the art of photography. Learn from expert photographers and enhance your skills!"); 
      `);
  
      await db.runAsync(`INSERT INTO "users_ll_for" ("username","city")
        VALUES ('Peppe','Turin'),
              ('Caca','Turin'),
              ('Caca','Bari');
      `);
      await db.runAsync(`INSERT INTO "users_events" ("user","event")
        VALUES ('Peppe','Boat trip'),
              ('Peppe','Karaoke'),
              ('Caca','Boat trip'),
               ('Pio','Karaoke'),
               ('Pio','Polito Party'),
               ('Peppe', 'Polito Party'),
               ('Fra', 'Polito Party'),
               ('Caca', 'Polito Party');  
      `);
      await db.runAsync(`INSERT INTO "icebreakers" ("name","description","rules")
        VALUES ('We are not really strangers',
        'We Are Not Really Strangers is a card-based game designed to deepen connections and foster meaningful conversations. 
          It features thought-provoking questions and prompts, encouraging players to share personal stories, reflections, and emotions.','Regole1'),
              ('Heads up!','Heads Up is a fun and fast-paced party game where players take turns guessing words or phrases displayed on a card or device held on their forehead. 
        Other players give clues by acting, describing, or making sounds to help them guess before the timer runs out. ','Regole2'),
              ('Never have I ever','Two Truths and a Lie is a classic icebreaker game where players share three statements about themselves: two truths and one lie.','Regole3'),
              ('Truth or dare','Never Have I Ever is a popular party game where players take turns sharing things they have never done.','Regole4');
      `);

      await db.runAsync(`INSERT INTO "heads_up" ("word")
        VALUES ('Cinema'),
              ('Pizza'),
              ('Football'),
              ('Basketball'),
              ('Ball'),
              ('Dog'),
              ('Cat'),
              ('Fish'),
              ('Car'),
              ('House'),
              ('Computer'),
              ('Phone'),
              ('Table'),
              ('Chair'),
              ('Book');
      `);

      await db.runAsync(`INSERT INTO "truth_or_dare" ("question")
        VALUES ('Have you ever cheated on a test?'),
              ('Have you ever lied to your parents?'),
              ('Have you ever stolen something?'),
              ('Have you ever been in a physical fight?'),
              ('Have you ever been in a car accident?'),
              ('Have you ever been arrested?'),
              ('Have you ever cheated on a partner?'),
              ('Have you ever been in love?'),
              ('Have you ever been in a long-distance relationship?'),
              ('Have you ever been in a relationship with someone much older or younger than you?'),
              ('Have you ever been in a relationship with someone you met online?'),
              ('Have you ever been in a relationship with someone you met at work?'),
              ('Have you ever played a prank on someone?');
      `);     
  
      await loadDatabase();
  
      currentDbVersion = 1;
    }
    else if (currentDbVersion === 1) {
      console.log('Migrating to version 2');
      await loadDatabase();
      currentDbVersion = 2;
    }
    await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
  
    try {
      const result = await db.getAllAsync<{ name: string }>("SELECT name FROM sqlite_master WHERE type='table';");
      console.log('Your Tables are:', result.map((table) => table.name));
      result.forEach((table) => {
        db.getAllAsync(`SELECT * FROM ${table.name};`).then(values => {
          values.forEach(value => {
            //console.log(`Table ${table.name} \t Value:`, value);
          });
        });
  
  
      });
    } catch (error) {
      console.error('Error listing tables:', error);
    }
  }