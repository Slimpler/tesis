

export const isAdmin = (req, res, next) => {
  if (!req.user || !req.user.roles.map((role) => role.name).includes("admin")) {
    return res.status(403).send({
      message: "Require Admin Role!",
    });
  }
  next();
};


export const isModerator = (req, res, next) => {
  if (!req.user || !req.user.roles.map((role) => role.name).includes("moderator")) {
    return res.status(403).send({
      message: "Require Moderator Role!",
    });
  }
  next();
};


export const isPaciente = (req, res, next) => {
  if (!req.user || !req.user.roles.map((role) => role.name).includes("paciente")) {
    return res.status(403).send({
      message: "Require Paciente Role!",
    });
  }
  next();
};

