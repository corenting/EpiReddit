//
//  Comment.swift
//  EpiReddit
//
//  Created by Rémi Faucheux on 04/07/2018.
//  Copyright © 2018 Novus. All rights reserved.
//

import Foundation

class Comment {
    var id:Int
    var content:String?
    var createdAt:Date
    var upvotes:Int
    var username:String
    var upvoted:Bool
    var downvoted:Bool
    
    init(id:Int) {
        self.id = id
        self.content = ""
        self.createdAt = Date()
        self.upvotes = 0
        self.username = ""
        self.upvoted = false
        self.downvoted = false
    }
}
