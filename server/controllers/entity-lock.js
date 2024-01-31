"use strict";

module.exports = {
  async getStatusBySlug(ctx) {
    const { slug } = ctx.request.params;
    const { id: userId } = ctx.state.user;

    const data = await strapi.db
      .query("plugin::record-locking.open-entity")
      .findOne({
        where: {
          entityType: slug,
          user: {
            $not: userId,
          },
        },
      });

    if (data) {
      const user = await strapi.db
        .query("admin::user")
        .findOne({ where: { id: data.user } });

      return {
        editedBy: `${user.firstname} ${user.lastname}`,
      };
    }

    return false;
  },

  async getStatusByIdAndSlug(ctx) {
    const { id, slug } = ctx.request.params;
    const { id: userId } = ctx.state.user;

    const data = await strapi.db
      .query("plugin::record-locking.open-entity")
      .findOne({
        where: {
          entityIdentifier: id,
          entityType: slug,
          user: {
            $not: userId,
          },
        },
      });

    if (data) {
      const user = await strapi.db
        .query("admin::user")
        .findOne({ where: { id: data.user } });

      return {
        editedBy: `${user.firstname} ${user.lastname}`,
      };
    }

    return false;
  },

  async setStatusByIdAndSlug(ctx) {
    const { id, slug } = ctx.request.params;
    const { id: userId } = ctx.state.user;

    await strapi.db.query("plugin::record-locking.open-entity").create({
      data: {
        user: String(userId),
        entityType: slug,
        entityIdentifier: id,
      },
    });

    return true;
  },
  async deleteStatusByIdAndSlug(ctx) {
    const { id, slug } = ctx.request.params;
    const { id: userId } = ctx.state.user;

    await strapi.db.query("plugin::record-locking.open-entity").deleteMany({
      where: {
        user: String(userId),
        entityType: slug,
        entityIdentifier: id,
      },
    });

    return "DELETED";
  },
};
