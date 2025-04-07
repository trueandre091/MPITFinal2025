"""create users, requests, leaders, config tables

Revision ID: aa9f9fd4d105
Revises: 
Create Date: 2025-04-07 14:02:02.016207

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'aa9f9fd4d105'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('configs',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('key', sa.String(), nullable=False),
    sa.Column('value', sa.String(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_configs_id'), 'configs', ['id'], unique=False)
    
    op.create_table('leaders',
    sa.Column('id', sa.BigInteger(), nullable=False),
    sa.Column('tg_id', sa.BigInteger(), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_leaders_id'), 'leaders', ['id'], unique=False)
    op.create_index(op.f('ix_leaders_tg_id'), 'leaders', ['tg_id'], unique=True)

    op.create_table('users',
    sa.Column('id', sa.BigInteger(), nullable=False),
    sa.Column('esia_token', sa.String(), nullable=True),
    sa.Column('name', sa.String(), nullable=True),
    sa.Column('role', sa.String(), nullable=True),
    sa.Column('tg_id', sa.BigInteger(), nullable=True),
    sa.Column('is_active', sa.Boolean(), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_users_esia_token'), 'users', ['esia_token'], unique=True)
    op.create_index(op.f('ix_users_id'), 'users', ['id'], unique=False)
    op.create_index(op.f('ix_users_tg_id'), 'users', ['tg_id'], unique=True)

    op.create_table('requests',
    sa.Column('id', sa.BigInteger(), nullable=False),
    sa.Column('user_id', sa.BigInteger(), nullable=True),
    sa.Column('responder_id', sa.BigInteger(), nullable=True),
    sa.Column('theme', sa.String(), nullable=True),
    sa.Column('message', sa.String(), nullable=True),
    sa.Column('is_closed', sa.Boolean(), nullable=True),
    sa.Column('rating', sa.Integer(), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['responder_id'], ['leaders.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_requests_id'), 'requests', ['id'], unique=False)
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f('ix_requests_id'), table_name='requests')
    op.drop_table('requests')
    op.drop_index(op.f('ix_users_tg_id'), table_name='users')
    op.drop_index(op.f('ix_users_id'), table_name='users')
    op.drop_index(op.f('ix_users_esia_token'), table_name='users')
    op.drop_table('users')
    op.drop_index(op.f('ix_leaders_tg_id'), table_name='leaders')
    op.drop_index(op.f('ix_leaders_id'), table_name='leaders')
    op.drop_table('leaders')
    op.drop_index(op.f('ix_configs_id'), table_name='configs')
    op.drop_table('configs')
    # ### end Alembic commands ###
