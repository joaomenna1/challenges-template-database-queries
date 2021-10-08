import { getRepository, Repository } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    return this.repository
      .createQueryBuilder("games")
      .where("lower(games.title) like :param", {
        param: `%${param.toLowerCase()}%`,
      })
      .getMany();
  }

  async countAllGames(): Promise<[{ count: string }]> {
    return this.repository.query(`SELECT count(*) FROM games`);
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    return this.repository
      .createQueryBuilder("games")
      .select([
        "user.email, user.first_name, user.last_name",
        "email, first_name, last_name",
      ])
      .leftJoin("games.users", "user")
      .where("games.id = :id", { id: id })
      .getRawMany();
  }
}

