export const menuPermissions: Record<
  string,
  string[]
> = {

  timeslot:[
    "admin",
    "Accès A",
  ],

  parents:[
    "admin",
    "Accès A",
  ],
  
  announcements: [
    "admin",
    "Directeur",
  ],

  dashboard: [
    "admin",
    "Accès A",
  ],

  reinscription: [
    "admin", 
    "Accès A"
  ],
  term: [
    "admin",
    "Accès A",
    
  ],

  admission: [
    "admin",
    "Accès A",
    
  ],

  staff: [
    "admin",
    "Accès A",
    
    
  ],

  classroom: [
    "admin",
    "Accès A",
    "Censeur",
  ],

  subjects: [
    "admin",
    "Accès A",
    
  ],
  assignment: [
    "admin",
    "Accès A",
    
    
  ],
  schedule: [
    "admin",
    "Accès A",
    "Censeur",
    "Educateur"
    
  ],

  grade: [
    "admin",
    "Accès A",
    "Censeur",
    
  ],

  messages: [
    "admin",
    "Accès A",
    "teacher",
    "Econome",
    "Educateur",
    "Censeur",
    "Parent"
    
  ],

  students: [
    "admin",
    "Accès A",
    "teacher",
    "Educateur"
  ],

  teachers: [
    "admin",
    "Accès A",
    
  ],

  academics: [
    "admin",
    "Accès A",
    "teacher",
    
  ],

  evaluations: [
    "admin",
    "Accès A",
    "Censeur",
  ],

  teacherAttendance: [
    "admin",
    "Accès A",
    "Censeur",
    "Educateur"
    
  ],

  studentAttendance: [
    "admin",
    "Accès A",
    "teacher",
    "Educateur"
   
  ],
  

  staffAttendance: [
    "admin",
    "Accès A",
    "Educateur"
    
  ],

  finance: [
    "admin",
    "Accès A",
    "econome",
  ],

  settings: [
    "admin",
    "Accès A",
  ],
};

export function canAccess(menu: string, user: any) {

  if (!user) return false;

  // superuser bypass
  if (user.is_superuser) {
    return true;
  }

  /*if(user.user_type=="Parent"){

    return true
  }*/

  const allowed =
    menuPermissions[menu];

  if (!allowed) {
    return false;
  }

  return allowed.includes(
    user?.role?.name
  );
}